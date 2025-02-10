export const poseInstructions = {
    Tree: [
        'Get into position. Tree pose often starts from mountain pose (or Tadasana), with both feet planted firmly on the ground and your weight adequately distributed so that you are balanced.',
        'Bend one leg at the knee. Choose the leg you are going to fold in first. If your left leg is your standing leg, keep your left foot planted on the ground, and slowly bend in your right leg at the right knee so that the sole of your right foot rests against your left inner thigh (known as the half-lotus position in Bikram yoga). Point the knee of your bent leg outward, away from your body.',
        'Lengthen your body. Clasp your hands together in Anjali Mudra (also called the “prayer position”)',
        'Hold and repeat. Hold the pose for as long as necessary, making sure to breathe properly. When you’re ready to switch legs, exhale, and return to mountain pose to start again.'
    ],
    Utkatasana: [
        'Stand with your feet together and arms at your sides.',
        'Inhale and raise your arms overhead, keeping them shoulder-width apart.',
        'Exhale and bend your knees, lowering your hips as if sitting in a chair.',
        'Keep your back straight and chest lifted, holding the pose for several breaths.'
    ],
    Paschimottanasana: [
        'Sit on the floor with your legs extended straight in front of you.',
        'Inhale and lengthen your spine, reaching your arms overhead.',
        'Exhale and hinge at your hips, reaching for your feet or shins.',
        'Hold the pose, breathing deeply and relaxing into the stretch.'
    ],
    Setu_Bandhasana: [
        'Lie on your back with your knees bent and feet flat on the floor, hip-width apart.',
        'Inhale and lift your hips towards the ceiling, pressing your feet into the ground.',
        'Clasp your hands under your back and hold the pose for several breaths.'
    ],
    Marjaryasana_Bitilasana: [
        'Start on your hands and knees in a tabletop position.',
        'Inhale and arch your back, lifting your head and tailbone (cow pose).',
        'Exhale and round your back, tucking your chin to your chest (cat pose).',
        'Repeat the sequence several times.',
        'Source: Yoga Journal - https://www.yogajournal.com/poses/cat-cow-pose'
    ],
    // Other poses...
};

export const tutorials = [
    '1. When App ask for permission of camera, allow it to access to capture pose.',
    '2. Select what pose you want to do in the dropdown.',
    '3. Read Instrctions of that pose so you will know how to do that pose.',
    '4. Click on Start pose and see the image of the that pose in the right side and replecate that image in front of camera.',
    '5. If you will do correctly the skeleton over the video will become green in color and sound will start playing'
];

export const fixCamera = [
    'Solution 1. Make sure you have allowed the permission of camera, if you have denined the permission, go to setting of your browser to allow the access of camera to the application.',
    'Solution 2. Make sure no any other application is not accessing camera at that time, if yes, close that application',
    'Solution 3. Try to close all the other opened broswers'
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
