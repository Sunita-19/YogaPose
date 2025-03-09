import React from 'react';
import { poseImages } from '../../utils/pose_images';
import './DropDown.css';

let poseList = [
    'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog', 'Shoulderstand', 'Triangle',
    'Tadasana', 'Adho_Mukha_Svanasana', 'Virabhadrasana I', 'Balasana', 
    'Paschimottanasana', 'Setu Bandhasana', 'Marjaryasana-Bitilasana'
];

export default function DropDown({ poseList, currentPose, setCurrentPose }) {
    return (
        <div className='dropdown dropdown-container'>
            <button 
                className="btn btn-secondary dropdown-toggle"
                type='button'
                data-bs-toggle="dropdown"
                id="pose-dropdown-btn"
                aria-expanded="false"
            >
                {currentPose}
            </button>
            <ul className="dropdown-menu dropdown-custom-menu" aria-labelledby="dropdownMenuButton1">
                {Array.isArray(poseList) && poseList.length > 0 ? (
                    poseList.map((pose) => (
                        <li key={pose} onClick={() => setCurrentPose(pose)}>
                            <div className="dropdown-item-container">
                                <p className="dropdown-item-1">{pose}</p>
                                <img 
                                    src={poseImages[pose]} 
                                    alt={pose} // Add alt text for accessibility
                                    className="dropdown-img"
                                />
                            </div>
                        </li>
                    ))
                ) : (
                    <li>
                        <p className="dropdown-item-1">No poses available</p>
                    </li>
                )}
            </ul>
        </div>
    );
}