import cv2
import mediapipe as mp
import numpy as np
import time
import math

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

SWIPE_THRESHOLD = 80  # pixel
PINCH_THRESHOLD = 0.05  # distanza normalizzata tra indice e pollice

prev_x = None
prev_time = None

def get_distance(p1, p2):
    return math.hypot(p1[0] - p2[0], p1[1] - p2[1])

def detect_gestures(landmarks, img_shape):
    gesture = "none"
    h, w, _ = img_shape

    index_finger_tip = landmarks[8]
    thumb_tip = landmarks[4]

    ix, iy = int(index_finger_tip.x * w), int(index_finger_tip.y * h)
    tx, ty = int(thumb_tip.x * w), int(thumb_tip.y * h)

    pinch_distance = get_distance(
        (index_finger_tip.x, index_finger_tip.y),
        (thumb_tip.x, thumb_tip.y)
    )

    if pinch_distance < PINCH_THRESHOLD:
        gesture = "pinch"

    global prev_x, prev_time
    current_time = time.time()

    if prev_x is not None and prev_time is not None:
        delta_x = ix - prev_x
        delta_time = current_time - prev_time

        if delta_time < 0.3 and abs(delta_x) > SWIPE_THRESHOLD:
            gesture = "swipe left" if delta_x < 0 else "swipe right"
            prev_x = None
            prev_time = None
        else:
            prev_x = ix
            prev_time = current_time
    else:
        prev_x = ix
        prev_time = current_time

    if iy < h * 0.8 and gesture == "none":
        gesture = "touch"

    return (ix, iy), gesture

cap = cv2.VideoCapture(0)

while cap.isOpened():
    success, image = cap.read()
    if not success:
        print("Errore webcam")
        break

    image = cv2.flip(image, 1)
    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    results = hands.process(rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            coords, gesture = detect_gestures(hand_landmarks.landmark, image.shape)

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

    if cv2.waitKey(1) & 0xFF == 27:
        break  # ESC per uscire

cap.release()
cv2.destroyAllWindows()
