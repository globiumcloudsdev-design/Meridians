import homeImage1 from "../assets/home/home images/home-1.jpg";
import homeImage2 from "../assets/home/home images/home-2.jpg";
import buildingConfidenceImage from "../assets/home/Building Confidence Through Expression/Building Confidence Through Expression-01.jpg";
import empoweringNextGenerationImage from "../assets/home/Empowering the Next Generations/Empowering the Next Generations iamge-01.jpg";
import academicExcellenceImage from "../assets/home/Innovative Learning Approach/Academic Excellence.jpg";
import creativeClassesImage from "../assets/home/Innovative Learning Approach/Creative Classes.jpg";
import sportsAndArtsImage from "../assets/home/Innovative Learning Approach/Sports & Arts.jpg";
import lifeAtMeridian1 from "../assets/home/Life at Meridian's/Life at Meridian's-01.jpg";
import lifeAtMeridian2 from "../assets/home/Life at Meridian's/Life at Meridian's-2.jpg";
import lifeAtMeridian2Alt from "../assets/home/Life at Meridian's/Life at Meridian's-2-01.jpg";
import nurturingInnovatorsImage from "../assets/home/Nurturing the Next Generation of Innovators/Nurturing the Next Generation of Innovators image-01.jpg";
import worldFacilityLibrary from "../assets/home/World-Class Facilities/Advanced Library-01.jpg";
import worldFacilityScienceLab from "../assets/home/World-Class Facilities/Modern Science Lab-01.jpg";
import worldFacilityArena from "../assets/home/World-Class Facilities/Indoor Sports Arena.jpg";
import worldFacilitySmartLab from "../assets/home/World-Class Facilities/Digital Smart Lab-02.jpg";

import aboutInspiration1 from "../assets/About/Our Inspirations/about pics-01.jpg";
import aboutInspiration2 from "../assets/About/Our Inspirations/about pics-02.jpg";
import aboutInspiration3 from "../assets/About/Our Inspirations/about pics-03.jpg";
import aboutInspiration4 from "../assets/About/Our Inspirations/about pics-04.jpg";
import aboutFoundation from "../assets/About/The Foundation/The Foundation-01-01.jpg";

import admissionsImage from "../assets/Admissions/Admissions-01.jpg";
import programHomeImage from "../assets/program/home-01.jpg";

export const homeAssets = {
    "home images": [homeImage1, homeImage2],
    "Building Confidence Through Expression": [buildingConfidenceImage],
    "Empowering the Next Generations": [empoweringNextGenerationImage],
    "Innovative Learning Approach": [
        academicExcellenceImage,
        creativeClassesImage,
        sportsAndArtsImage,
    ],
    "Life at Meridian's": [lifeAtMeridian1, lifeAtMeridian2, lifeAtMeridian2Alt],
    "Nurturing the Next Generation of Innovators": [nurturingInnovatorsImage],
    "World-Class Facilities": [
        worldFacilityLibrary,
        worldFacilityScienceLab,
        worldFacilityArena,
        worldFacilitySmartLab,
    ],
} as const;

export const aboutAssets = {
    "Our Inspirations": [
        aboutInspiration1,
        aboutInspiration2,
        aboutInspiration3,
        aboutInspiration4,
    ],
    "The Foundation": [aboutFoundation],
} as const;

export const admissionsAssets = {
    Admissions: [admissionsImage],
};

export const programAssets = {
    Program: [programHomeImage],
};

export const homeAllImages = Object.values(homeAssets).flat();
export const homeFeatureImages = homeAssets["Innovative Learning Approach"];
export const homeFacilityImages = homeAssets["World-Class Facilities"];
export const aboutHeroImage = aboutAssets["Our Inspirations"][0];
export const admissionsHeroImage = admissionsAssets.Admissions[0];
export const programHeroImage = programAssets.Program[0];
