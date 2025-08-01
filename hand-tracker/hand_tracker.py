import cv2
import mediapipe as mp
import time
import math

class HandTracker:
    def __init__(self,
                 max_num_hands=2,
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

        self.prev_positions = {}  # per mano: id -> prev_x
        self.prev_times = {}      # per mano: id -> prev_time

    def get_distance(self, p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    def detect_gestures(self, hand_id, landmarks, img_shape):
        gesture = "none"
        h, w, _ = img_shape

        index_finger_tip = landmarks[8]
        thumb_tip = landmarks[4]

        ix, iy = int(index_finger_tip.x * w), int(index_finger_tip.y * h)

        pinch_distance = self.get_distance(
            (index_finger_tip.x, index_finger_tip.y),
            (thumb_tip.x, thumb_tip.y)
        )

        if pinch_distance < self.PINCH_THRESHOLD:
            gesture = "pinch"

        current_time = time.time()

        if hand_id in self.prev_positions and hand_id in self.prev_times:
            prev_x = self.prev_positions[hand_id]
            prev_time = self.prev_times[hand_id]

            delta_x = ix - prev_x
            delta_time = current_time - prev_time

            if delta_time < 0.3 and abs(delta_x) > self.SWIPE_THRESHOLD:
                gesture = "swipe left" if delta_x < 0 else "swipe right"
                self.prev_positions.pop(hand_id)
                self.prev_times.pop(hand_id)
            else:
                self.prev_positions[hand_id] = ix
                self.prev_times[hand_id] = current_time
        else:
            self.prev_positions[hand_id] = ix
            self.prev_times[hand_id] = current_time

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

            gestures = []
            coords_list = []

            if results.multi_hand_landmarks:
                for i, hand_landmarks in enumerate(results.multi_hand_landmarks):
                    self.mp_drawing.draw_landmarks(image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

                    coords, gesture = self.detect_gestures(i, hand_landmarks.landmark, image.shape)
                    gestures.append(gesture)
                    coords_list.append(coords)

                    cv2.circle(image, coords, 10, (0, 255, 0), -1)
                    cv2.putText(
                        image,
                        f"{gesture} Hand {i}",
                        (coords[0], coords[1] - 20),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.7,
                        (255, 0, 0),
                        2
                    )

            # Riconoscimento double pinch
            if gestures.count("pinch") == 2:
                cv2.putText(
                    image,
                    "Double Pinch!",
                    (30, 60),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1.5,
                    (0, 0, 255),
                    3
                )

            cv2.imshow('Hand Tracker', image)

            if cv2.waitKey(1) & 0xFF == 27:  # ESC per uscire
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = HandTracker(
        max_num_hands=2,
        min_detection_confidence=0.8,
        min_tracking_confidence=0.7,
        swipe_threshold=70,
        pinch_threshold=0.04
    )
    tracker.start()
