export const poseInstructions = {
    Tree: [
        'Get into position. Tree pose often starts from mountain pose (or Tadasana), with both feet planted firmly on the ground and your weight adequately distributed so that you are balanced.',
        'Bend one leg at the knee. Choose the leg you are going to fold in first. If your left leg is your standing leg, keep your left foot planted on the ground, and slowly bend in your right leg at the right knee so that the sole of your right foot rests against your left inner thigh. Point the knee of your bent leg outward, away from your body.',
        'Lengthen your body. Clasp your hands together in Anjali Mudra (prayer position).',
        'Hold and repeat. Hold the pose for as long as needed, and then switch legs.'
    ],
    Cobra: [
        'Lie prone on the floor with your legs stretched back and the tops of your feet on the floor.',
        'Place your hands under your shoulders. On an inhalation, gently press through your hands to lift your chest off the floor while keeping a light bend in your elbows.',
        'Maintain a soft gaze forward and hold the position while breathing steadily.',
        'Exhale and return to the starting position.'
    ],
    Dog: [
        'Come onto your hands and knees with your hands a little in front of your shoulders.',
        'Exhale and lift your knees off the floor, reaching your hips up and back to form an inverted V-shape.',
        'Press your heels gently toward the floor, and keep your head between your upper arms.',
        'Hold the pose for several breaths.'
    ],
    Chair: [
        'Stand with your feet slightly wider than hip-width apart and arms at your sides.',
        'Inhale and lift your arms parallel to the floor as you begin to bend your knees, as if preparing to sit in a chair.',
        'Keep your weight on your heels and your back straight.',
        'Hold the pose for 30 seconds to a minute, breathing steadily.'
    ],
    Warrior: [
        'Begin in a lunge position with the front knee bent and the back leg straight.',
        'Rotate your back foot slightly and raise your arms overhead, palms facing each other.',
        'Ensure your hips and shoulders face forward and hold the pose while breathing deeply.'
    ],
    Triangle: [
        'Stand with your feet wide apart.',
        'Turn your left foot out 90 degrees and your right foot in slightly, then extend your arms out to the sides.',
        'Lean over your left leg and reach your left hand down toward your left foot, while your right hand stretches upward.',
        'Keep your chest open and spine long as you hold the pose. Repeat on the other side.'
    ],
    Shoulderstand: [
        'Lie on your back with your shoulders on a folded blanket for support.',
        'Lift your legs and hips off the ground, supporting your lower back with your hands.',
        'Align your body in a straight line, and hold the pose while keeping your gaze upward.',
        'Exhale and slowly lower your body back to the floor.'
    ],
    // Newly added poses:
    Tadasana: [
        'Stand tall with your feet together or hip-width apart.',
        'Distribute your weight evenly through your feet and engage your leg muscles.',
        'Lift your chest, roll your shoulders back and down, and let your arms hang naturally at your sides.',
        'Focus on your breath and hold the pose for a few deep breaths.'
    ],
    'Adho Mukha Svanasana': [
        'Start on your hands and knees on a mat, with your wrists directly under your shoulders and knees under your hips.',
        'Spread your fingers wide and press firmly into the mat, lifting your hips up and back.',
        'Straighten your legs as much as possible, but keep a slight bend in your knees if needed.',
        'Relax your head between your arms and hold the inverted V-shape for several breaths.'
    ],
    'Virabhadrasana I': [
        'Step into a lunge with your right foot forward, keeping the left leg straight and turned slightly inwards.',
        'Raise your arms overhead with palms facing each other while keeping your shoulders down.',
        'Square your hips toward the front and ensure your front knee is directly over your ankle.',
        'Hold the pose while breathing deeply and then repeat on the opposite side.'
    ],
    Balasana: [
        'Kneel on the mat with your knees spread apart, big toes touching.',
        'Sit back on your heels and lean forward, lowering your chest to rest on your thighs and your forehead to the mat.',
        'Stretch your arms forward or let them rest alongside your body.',
        'Breathe deeply, relaxing in the pose for as long as comfortable.'
    ],
    'Setu Bandhasana': [
        'Lie on your back with your knees bent and your feet flat on the mat, hip-width apart.',
        'Press your feet into the floor as you slowly lift your hips toward the ceiling.',
        'Interlace your fingers under your back and roll onto your shoulders to lift your chest higher.',
        'Hold the pose for a few breaths before lowering your hips down.'
    ],
    'Marjaryasana-Bitilasana': [
        'Begin on your hands and knees in a tabletop position with your wrists under your shoulders and knees under your hips.',
        'On an inhalation, lower your belly, lift your head and tailbone (Cow Pose).',
        'On an exhalation, round your spine upward, tucking your chin toward your chest (Cat Pose).',
        'Alternate between these two movements slowly, coordinating your breath with the motion.'
    ],
    Paschimottanasana: [
        'Sit on the floor with your legs straight in front of you and your spine upright.',
        'Inhale to lengthen your spine, and slowly lean forward from the hips while keeping your back as flat as possible.',
        'Reach your hands toward your feet, ankles, or shins, depending on your flexibility.',
        'Relax your neck and hold the pose for several deep breaths, then gently return to an upright seated position.'
    ]
};

export const tutorials = [
    '1. Allow camera permission when the app requests access for capturing your pose.',
    '2. Select the pose you want to perform from the dropdown menu.',
    '3. Read the instructions for the selected pose to understand the correct alignment and posture.',
    '4. Click on "Start Pose" to see the reference image of the pose, and replicate it in front of the camera.',
    '5. When performed correctly, the skeleton will change to a green color and audio cues will play.'
];

export const fixCamera = [
    'Solution 1: Make sure you have allowed camera permission. If denied, change the settings in your browser.',
    'Solution 2: Close any other applications that might be using the camera.',
    'Solution 3: Try closing other open browsers and restart the application.'
];

export const POINTS = {
    NOSE : 0,
    LEFT_EYE : 1,
    RIGHT_EYE : 2,
    LEFT_EAR : 3,
    RIGHT_EAR : 4,
    LEFT_SHOULDER : 5,
    RIGHT_SHOULDER : 6,
    LEFT_ELBOW : 7,
    RIGHT_ELBOW : 8,
    LEFT_WRIST : 9,
    RIGHT_WRIST : 10,
    LEFT_HIP : 11,
    RIGHT_HIP : 12,
    LEFT_KNEE : 13,
    RIGHT_KNEE : 14,
    LEFT_ANKLE : 15,
    RIGHT_ANKLE : 16,
};

export const keypointConnections = {
    nose: ['left_ear', 'right_ear'],
    left_ear: ['left_shoulder'],
    right_ear: ['right_shoulder'],
    left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
    right_shoulder: ['right_elbow', 'right_hip'],
    left_elbow: ['left_wrist'],
    right_elbow: ['right_wrist'],
    left_hip: ['left_knee', 'right_hip'],
    right_hip: ['right_knee'],
    left_knee: ['left_ankle'],
    right_knee: ['right_ankle']
};