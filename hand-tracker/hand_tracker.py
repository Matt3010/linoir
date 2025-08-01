import cv2
import mediapipe as mp
import time
import math

class HandTracker:
    def __init__(self,
                 max_num_hands=1,
                 min_detection_confidence=0.7,
                 min_tracking_confidence=0.5,
                 swipe_threshold=80,
                 pinch_threshold=0.05):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils

        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

        self.SWIPE_THRESHOLD = swipe_threshold
        self.PINCH_THRESHOLD = pinch_threshold
        self.DOUBLE_PINCH_MAX_INTERVAL = 0.5  # secondi massimo tra pinch consecutivi

        self.prev_x = None
        self.prev_time = None

        self.last_pinch_time = None
        self.pinch_count = 0

    def get_distance(self, p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    def detect_gestures(self, landmarks, img_shape):
        gesture = "none"
        h, w, _ = img_shape

        index_finger_tip = landmarks[8]
        thumb_tip = landmarks[4]

        ix, iy = int(index_finger_tip.x * w), int(index_finger_tip.y * h)

        pinch_distance = self.get_distance(
            (index_finger_tip.x, index_finger_tip.y),
            (thumb_tip.x, thumb_tip.y)
        )

        current_time = time.time()

        if pinch_distance < self.PINCH_THRESHOLD:
            # Rilevato pinch
            if self.last_pinch_time is None:
                # Primo pinch
                self.last_pinch_time = current_time
                self.pinch_count = 1
                gesture = "pinch"
            else:
                # Verifica se entro il tempo per il double pinch
                if (current_time - self.last_pinch_time) <= self.DOUBLE_PINCH_MAX_INTERVAL:
                    self.pinch_count += 1
                    self.last_pinch_time = current_time
                    if self.pinch_count == 2:
                        gesture = "touch"  # doppio pinch = touch
                        self.pinch_count = 0
                        self.last_pinch_time = None
                    else:
                        gesture = "pinch"
                else:
                    # troppo tempo passato, resetto
                    self.pinch_count = 1
                    self.last_pinch_time = current_time
                    gesture = "pinch"
        else:
            # Nessun pinch attuale, ma se troppo tempo passato resetto contatore
            if self.last_pinch_time and (current_time - self.last_pinch_time) > self.DOUBLE_PINCH_MAX_INTERVAL:
                self.pinch_count = 0
                self.last_pinch_time = None

        # Rilevamento swipe (come prima)
        if gesture == "none":
            if self.prev_x is not None and self.prev_time is not None:
                delta_x = ix - self.prev_x
                delta_time = current_time - self.prev_time

                if delta_time < 0.3 and abs(delta_x) > self.SWIPE_THRESHOLD:
                    gesture = "swipe left" if delta_x < 0 else "swipe right"
                    self.prev_x = None
                    self.prev_time = None
                else:
                    self.prev_x = ix
                    self.prev_time = current_time
            else:
                self.prev_x = ix
                self.prev_time = current_time

        return (ix, iy), gesture

    def start(self, camera_index=0):
        cap = cv2.VideoCapture(camera_index)
        if not cap.isOpened():
            print("Errore: Impossibile aprire la webcam")
            return

        while True:
            success, image = cap.read()
            if not success:
                print("Errore nella lettura del frame")
                break

            image = cv2.flip(image, 1)
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            results = self.hands.process(rgb)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

                    coords, gesture = self.detect_gestures(hand_landmarks.landmark, image.shape)

                    cv2.circle(image, coords, 10, (0, 255, 0), -1)
                    cv2.putText(
                        image,
                        f"{gesture} @ {coords}",
                        (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1,
                        (255, 0, 0),
                        2
                    )

            cv2.imshow('Hand Tracker', image)

            if cv2.waitKey(1) & 0xFF == 27:  # ESC per uscire
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = HandTracker(
        max_num_hands=1,
        min_detection_confidence=0.8,
        min_tracking_confidence=0.7,
        swipe_threshold=70,
        pinch_threshold=0.04
    )
    tracker.start()
