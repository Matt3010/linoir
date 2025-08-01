import cv2
import mediapipe as mp
import math

class HandTracker:
    def __init__(self, pinch_threshold=0.05):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.PINCH_THRESHOLD = pinch_threshold

    def get_distance(self, p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    def detect_pinch(self, landmarks, img_shape):
        h, w, _ = img_shape
        index_finger_tip = landmarks[8]
        thumb_tip = landmarks[4]

        ix, iy = int(index_finger_tip.x * w), int(index_finger_tip.y * h)
        pinch_distance = self.get_distance(
            (index_finger_tip.x, index_finger_tip.y),
            (thumb_tip.x, thumb_tip.y)
        )

        is_pinch = pinch_distance < self.PINCH_THRESHOLD
        return (ix, iy), is_pinch

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
                    coords, is_pinch = self.detect_pinch(hand_landmarks.landmark, image.shape)

                    color = (0, 0, 255) if is_pinch else (0, 255, 0)
                    text = f"Pinch @ {coords}" if is_pinch else ""

                    cv2.circle(image, coords, 10, color, -1)
                    if is_pinch:
                        cv2.putText(image, text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

            cv2.imshow('Hand Tracker', image)
            if cv2.waitKey(1) & 0xFF == 27:  # ESC per uscire
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = HandTracker(pinch_threshold=0.04)
    tracker.start()
