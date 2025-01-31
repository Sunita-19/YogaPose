import React from "react";
import { useParams } from "react-router-dom";
import "./AsanaDetailPage.css";

const AsanaDetailPage = () => {
  const { asana } = useParams();

  // Define detailed information for each asana
  const asanaDetails = {
    "Tadasana": {
      name: "Tadasana",
      description: "Tadasana is the basic standing pose that forms the foundation for other asanas. It helps improve posture, balance, and stability.",
      tutorial: "Stand tall with your feet together, arms at your sides, and body relaxed. Engage your core and breathe deeply.",
      videoUrl: "https://www.youtube.com/embed/7GyC_UVFGU0",
      image: "https://example.com/tadasana.jpg", // replace with real image URL
    },
    "Adho Mukha Svanasana": {
      name: "Adho Mukha Svanasana",
      description: "This is the Downward Dog pose. It helps stretch the back, legs, and arms, improving strength and flexibility.",
      tutorial: "Start on your hands and knees, lift your hips towards the sky, and keep your feet flat on the ground.",
      videoUrl: "https://www.youtube.com/embed/_LvGTQ3Aq-g",
      image: "https://example.com/adho-mukha-svanasana.jpg", // replace with real image URL
    },
    "Virabhadrasana I": {
      name: "Virabhadrasana I",
      description: "Warrior I Pose builds strength and stamina in the legs, improves posture, and increases flexibility in the hips.",
      tutorial: "Start in Tadasana. Step one foot back and bend the front knee. Raise your arms overhead, keeping your back leg straight.",
      videoUrl: "https://www.youtube.com/embed/LKmOScV3dh4",
      image: "https://example.com/virabhadrasana-i.jpg", // replace with real image URL
    },
    "Vrikshasana": {
      name: "Vrikshasana",
      description: "Tree Pose improves balance, strengthens the legs, and opens the hips. It also enhances concentration.",
      tutorial: "Stand tall and shift your weight onto one leg. Place the sole of the opposite foot on the inner thigh or calf of the standing leg.",
      videoUrl: "https://www.youtube.com/embed/7GyC_UVFGU0",
      image: "https://example.com/vrikshasana.jpg", // replace with real image URL
    },
    "Balasana": {
      name: "Balasana",
      description: "Child's Pose is a resting pose that stretches the back and relieves stress. It’s a calming posture.",
      tutorial: "Kneel on the floor with your big toes touching. Lower your torso to the floor and extend your arms forward.",
      videoUrl: "https://www.youtube.com/embed/HcklIuKHEbM",
      image: "https://example.com/balasana.jpg", // replace with real image URL
    },
    "Bhujangasana": {
      name: "Bhujangasana",
      description: "Cobra Pose helps strengthen the spine and open the chest. It also improves flexibility in the back.",
      tutorial: "Lie face down with your hands under your shoulders. Press your palms into the floor and lift your chest up, straightening your arms.",
      videoUrl: "https://www.youtube.com/embed/lq7Wa8Tx5kY",
      image: "https://example.com/bhujangasana.jpg", // replace with real image URL
    },
    "Paschimottanasana": {
      name: "Paschimottanasana",
      description: "Seated Forward Bend stretches the back and hamstrings, helping to calm the mind and relieve stress.",
      tutorial: "Sit with your legs extended straight in front of you. Inhale, lengthen the spine, and exhale to fold forward.",
      videoUrl: "https://www.youtube.com/embed/0hrvll5a0aE",
      image: "https://example.com/paschimottanasana.jpg", // replace with real image URL
    },
    "Setu Bandhasana": {
      name: "Setu Bandhasana",
      description: "Bridge Pose strengthens the back, legs, and core, and opens the chest, improving flexibility in the spine.",
      tutorial: "Lie on your back with your knees bent. Lift your hips towards the sky and clasp your hands under your back.",
      videoUrl: "https://www.youtube.com/embed/gO2ezKms3VY",
      image: "https://example.com/setu-bandhasana.jpg", // replace with real image URL
    },
    "Marjaryasana": {
      name: "Marjaryasana",
      description: "Cat Pose stretches the spine and back, improving flexibility and relieving tension.",
      tutorial: "Begin in a tabletop position. As you inhale, arch your back and look up (cow pose). As you exhale, round your back and tuck your chin (cat pose).",
      videoUrl: "https://www.youtube.com/embed/2dM1jIFXyIE",
      image: "https://example.com/marjaryasana.jpg", // replace with real image URL
    },
    "Utkatasana": {
      name: "Utkatasana",
      description: "Chair Pose strengthens the thighs, glutes, and core. It also improves balance and stability.",
      tutorial: "Stand with your feet hip-width apart. Bend your knees as if you're sitting back into a chair, keeping your weight in your heels.",
      videoUrl: "https://www.youtube.com/embed/dPVd5zEpcM0",
      image: "https://example.com/utkatasana.jpg", // replace with real image URL
    },
    "Trikonasana": {
      name: "Trikonasana",
      description: "Triangle Pose stretches the legs and hips, improves flexibility, and enhances balance.",
      tutorial: "Stand with your feet wide apart. Turn one foot out and extend your arms. Lean over to the side, reaching your hand to the foot.",
      videoUrl: "https://www.youtube.com/embed/6D7LNBO3TOs",
      image: "https://example.com/trikonasana.jpg", // replace with real image URL
    },
    "Ardha Chandrasana": {
      name: "Ardha Chandrasana",
      description: "Half Moon Pose improves balance and strengthens the legs while stretching the spine and hips.",
      tutorial: "From Warrior II, shift your weight onto one leg and lift the other leg up. Reach one arm towards the floor and the other towards the sky.",
      videoUrl: "https://www.youtube.com/embed/8cF6WbduoMI",
      image: "https://example.com/ardha-chandrasana.jpg", // replace with real image URL
    },
    "Virabhadrasana II": {
      name: "Virabhadrasana II",
      description: "Warrior II strengthens the legs and arms, opens the hips, and improves focus and stamina.",
      tutorial: "From Tadasana, step one foot back and bend the front knee. Extend your arms parallel to the floor and gaze over your front hand.",
      videoUrl: "https://www.youtube.com/embed/o3pJd2NKcFQ",
      image: "https://example.com/virabhadrasana-ii.jpg", // replace with real image URL
    },
    "Bakasana": {
      name: "Bakasana",
      description: "Crow Pose strengthens the arms, core, and wrists while improving balance and coordination.",
      tutorial: "Start in a squat position. Place your knees on your upper arms, shift forward, and lift your feet off the ground.",
      videoUrl: "https://www.youtube.com/embed/4uI2GVnFdl0",
      image: "https://example.com/bakasana.jpg", // replace with real image URL
    },
    "Navasana": {
      name: "Navasana",
      description: "Boat Pose strengthens the core, improves balance, and stimulates the abdominal organs.",
      tutorial: "Sit on the floor and lift your legs to a 45-degree angle. Extend your arms forward and hold the position.",
      videoUrl: "https://www.youtube.com/embed/mg1D8f4Fv3Y",
      image: "https://example.com/navasana.jpg", // replace with real image URL
    },
    "Phalakasana": {
      name: "Phalakasana",
      description: "Plank Pose strengthens the core, arms, and legs while improving posture and stability.",
      tutorial: "Start in a push-up position with your body in a straight line from head to heels. Hold the position.",
      videoUrl: "https://www.youtube.com/embed/8e9QJHf-8ok",
      image: "https://example.com/phalakasana.jpg", // replace with real image URL
    },
    "Parivrtta Trikonasana": {
      name: "Parivrtta Trikonasana",
      description: "Revolved Triangle Pose stretches the legs and spine, improves flexibility, and strengthens the core.",
      tutorial: "From Triangle Pose, twist your torso and reach your opposite hand to the floor, while the other arm extends to the ceiling.",
      videoUrl: "https://www.youtube.com/embed/3gGnxgJxe0s",
      image: "https://example.com/parivrtta-trikonasana.jpg", // replace with real image URL
    },
    "Eka Pada Rajakapotasana": {
      name: "Eka Pada Rajakapotasana",
      description: "One-Legged King Pigeon Pose stretches the hips and thighs while improving flexibility and opening the chest.",
      tutorial: "Start in a pigeon pose. Bend the back leg and reach behind to hold the foot with both hands.",
      videoUrl: "https://www.youtube.com/embed/vmZIHuFxbAk",
      image: "https://example.com/eka-pada-rajakapotasana.jpg", // replace with real image URL
    },
    "Ustrasana": {
      name: "Ustrasana",
      description: "Camel Pose opens the chest and hips while stretching the back, improving flexibility and posture.",
      tutorial: "Kneel on the floor, place your hands on your lower back, and lean backward, reaching your hands for your heels.",
      videoUrl: "https://www.youtube.com/embed/fLKNiXyKmfY",
      image: "https://example.com/ustrasana.jpg", // replace with real image URL
    },
    "Vrschikasana": {
      name: "Vrschikasana",
      description: "Scorpion Pose strengthens the arms and core while opening the chest and improving balance.",
      tutorial: "Begin in a forearm plank position, then shift your weight forward and lift your legs over your head.",
      videoUrl: "https://www.youtube.com/embed/U5bKNLdlp6w",
      image: "https://example.com/vrschikasana.jpg", // replace with real image URL
    },
    "Tittibhasana": {
      name: "Tittibhasana",
      description: "Firefly Pose enhances balance and flexibility in the hamstrings while strengthening the arms and core.",
      tutorial: "Squat down, extend your legs, and place your hands on the floor in front. Balance your weight on your arms.",
      videoUrl: "https://www.youtube.com/embed/R1coX_qgBOI",
      image: "https://example.com/tittibhasana.jpg", // replace with real image URL
    },
    "Sirsasana": {
      name: "Sirsasana",
      description: "Headstand helps to increase circulation to the brain, improving mental clarity and stimulating the core.",
      tutorial: "Start on your knees, interlace your fingers, and place your forearms on the ground. Lift your legs, bringing your feet to the floor.",
      videoUrl: "https://www.youtube.com/embed/8UG7iTP2l2M",
      image: "https://example.com/sirsasana.jpg", // replace with real image URL
    },
    "Adho Mukha Vrksasana": {
      name: "Adho Mukha Vrksasana",
      description: "Handstand strengthens the arms, core, and back while improving balance and focus.",
      tutorial: "Begin in a downward dog position, kick up your legs to bring your feet off the ground and into a handstand.",
      videoUrl: "https://www.youtube.com/embed/hIXXrrYd4Ag",
      image: "https://example.com/adho-mukha-vrksasana.jpg", // replace with real image URL
    }
  };

  // Retrieve the asana details based on the selected asana
  const asanaData = asanaDetails[asana];

  return (
    <div className="asana-detail-page">
      <h1>{asanaData.name}</h1>
      <div className="asana-description">
        <p>{asanaData.description}</p>
        <p><strong>Tutorial:</strong> {asanaData.tutorial}</p>
      </div>
      <div className="asana-video">
        <iframe
          title={asanaData.name}
          width="560"
          height="315"
          src={asanaData.videoUrl}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <div className="asana-image">
        <img src={asanaData.image} alt={asanaData.name} />
      </div>
    </div>
  );
};

export default AsanaDetailPage;
