import { drawSkeleton } from './utilities';

// Mock data for testing
const mockKeypoints = [
    { position: { y: 0.5, x: 0.5 }, score: 0.9 },
    // Add more mock keypoints as needed for testing
];

// List of additional poses to test
const additionalPoses = [
    "Tadasana",
    "Adho Mukha Svanasana",
    "Virabhadrasana I",
    "Vrikshasana",
    "Balasana",
    "Bhujangasana",
    "Paschimottanasana",
    "Setu Bandhasana",
    "Marjaryasana-Bitilasana",
    "Utkatasana",
    "Ardha Chandrasana",
    "Virabhadrasana II",
    "Bakasana",
    "Navasana",
    "Phalakasana",
    "Parivrtta Trikonasana",
    "Eka Pada Rajakapotasana",
    "Ustrasana",
    "Vrschikasana",
    "Tittibhasana",
    "Sirsasana",
    "Adho Mukha Vrksasana",
    "Pincha Mayurasana",
    "Eka Pada Galavasana",
    "Kapotasana",
    "Mayurasana",
    "Urdhva Dhanurasana",
    "Dhanurasana"
];

// Simulate a canvas context for testing
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Call the drawSkeleton function with mock data
drawSkeleton(mockKeypoints, 0.5, ctx, 1, additionalPoses);
console.log("Pose detection test executed.");
