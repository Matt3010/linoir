import cv2
import mediapipe as mp
import math
import time
import collections

class HandTracker:
    def __init__(self, pinch_threshold=0.04, hold_time=1.5, circle_buffer_size=15, circle_threshold=0.7):
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.PINCH_THRESHOLD = pinch_threshold
        self.HOLD_TIME = hold_time
        self.CIRCLE_BUFFER_SIZE = circle_buffer_size
        self.CIRCLE_THRESHOLD = circle_threshold

        self.pinch_start_time = None
        self.is_holding = False

        self.positions_buffer = collections.deque(maxlen=self.CIRCLE_BUFFER_SIZE)

    def get_distance(self, p1, p2):
        return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

    def detect_pinch(self, landmarks, img_shape):
        h, w, _ = img_shape
        index_tip = landmarks[8]
        thumb_tip = landmarks[4]

        ix, iy = index_tip.x * w, index_tip.y * h
        tx, ty = thumb_tip.x * w, thumb_tip.y * h

        pinch_distance = self.get_distance((index_tip.x, index_tip.y), (thumb_tip.x, thumb_tip.y))

        is_pinch = pinch_distance < self.PINCH_THRESHOLD
        coords = (int(ix), int(iy))
        return coords, is_pinch

    def detect_pinch_and_hold(self, is_pinch):
        current_time = time.time()
        if is_pinch:
            if self.pinch_start_time is None:
                self.pinch_start_time = current_time
                self.is_holding = False
            elif (current_time - self.pinch_start_time) > self.HOLD_TIME:
                self.is_holding = True
        else:
            self.pinch_start_time = None
            self.is_holding = False
        return self.is_holding

    def detect_circle(self, coords):
        # Aggiungi nuova posizione al buffer
        self.positions_buffer.append(coords)

        # Non abbastanza punti per valutare
        if len(self.positions_buffer) < self.CIRCLE_BUFFER_SIZE:
            return False

        # Calcola centroide
        xs = [p[0] for p in self.positions_buffer]
        ys = [p[1] for p in self.positions_buffer]
        center_x = sum(xs) / len(xs)
        center_y = sum(ys) / len(ys)

        # Calcola distanze da centroide
        distances = [math.hypot(x - center_x, y - center_y) for x, y in self.positions_buffer]
        mean_dist = sum(distances) / len(distances)
        variance = sum((d - mean_dist) ** 2 for d in distances) / len(distances)
        std_dev = math.sqrt(variance)

        # Se la deviazione standard è bassa rispetto alla media, vuol dire che i punti sono distribuiti in modo circolare
        circularity = std_dev / mean_dist if mean_dist != 0 else 1.0

        # Soglia: più basso è circularity, più è circolare
        is_circle = circularity < self.CIRCLE_THRESHOLD
        return is_circle

    def start(self, camera_index=0):
        cap = cv2.VideoCapture(camera_index)
        if not cap.isOpened():
            print("Errore: impossibile aprire la webcam")
            return

        while True:
            success, image = cap.read()
            if not success:
                print("Errore nella lettura del frame")
                break

            image = cv2.flip(image, 1)
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            results = self.hands.process(rgb)

            gesture_text = ""
            color = (0, 255, 0)

            if results.multi_hand_landmarks:
                for hand_landmarks in results.multi_hand_landmarks:
                    self.mp_drawing.draw_landmarks(image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)

                    coords, is_pinch = self.detect_pinch(hand_landmarks.landmark, image.shape)

                    is_hold = self.detect_pinch_and_hold(is_pinch)
                    is_circle = self.detect_circle(coords)

                    if is_hold:
                        gesture_text = "Pinch and Hold"
                        color = (255, 0, 0)
                    elif is_circle:
                        gesture_text = "Circle Gesture"
                        color = (0, 0, 255)
                    elif is_pinch:
                        gesture_text = "Pinch"
                        color = (0, 255, 0)
                    else:
                        gesture_text = ""
                        color = (0, 255, 0)

                    cv2.circle(image, coords, 10, color, -1)
                    if gesture_text:
                        cv2.putText(image, f"{gesture_text} @ {coords}", (10, 30),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)

            cv2.imshow('Hand Tracker', image)
            if cv2.waitKey(1) & 0xFF == 27:  # ESC per uscire
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    tracker = HandTracker()
    tracker.start()
