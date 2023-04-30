import mercuryTexture from '../../img/solar/mercury.jpg';
import venusTexture from '../../img/solar/venus.jpg';
import earthTexture from '../../img/solar/earth.jpg';
import marsTexture from '../../img/solar/mars.jpg';
import jupiterTexture from '../../img/solar/jupiter.jpg';
import saturnTexture from '../../img/solar/saturn.jpg';
import saturnRingTexture from '../../img/solar/saturn ring.png';
import uranusTexture from '../../img/solar/uranus.jpg';
import uranusRingTexture from '../../img/solar/uranus ring.png';
import neptuneTexture from '../../img/solar/neptune.jpg';
import plutoTexture from '../../img/solar/pluto.jpg';

export const planetsData = {
    mercury: {
        size: 3.2,
        texture: mercuryTexture,
        position: 28,
        rotation: {
            aroundSun: 0.04,
            aroundSelf: 0.004
        }
    },
    venus: {
        size: 5.8,
        texture: venusTexture,
        position: 44,
        rotation: {
            aroundSun: 0.015,
            aroundSelf: 0.002
        }
    },
    earth: {
        size: 6,
        texture: earthTexture,
        position: 62,
        rotation: {
            aroundSun: 0.01,
            aroundSelf: 0.02
        }
    },
    mars: {
        size: 4,
        texture: marsTexture,
        position: 78,
        rotation: {
            aroundSun: 0.008,
            aroundSelf: 0.018
        }
    },
    jupiter: {
        size: 12,
        texture: jupiterTexture,
        position: 100,
        rotation: {
            aroundSun: 0.002,
            aroundSelf: 0.04
        }
    },
    saturn: {
        size: 10,
        texture: saturnTexture,
        position: 138,
        rotation: {
            aroundSun: 0.0009,
            aroundSelf: 0.038
        },
        rings: {
            size: [10, 20],
            texture: saturnRingTexture
        }
    },
    uranus: {
        size: 7,
        texture: uranusTexture,
        position: 176,
        rotation: {
            aroundSun: 0.0004,
            aroundSelf: 0.03
        },
        rings: {
            size: [7, 12],
            texture: uranusRingTexture}
    },
    neptune: {
        size: 7,
        texture: neptuneTexture,
        position: 200,
        rotation: {
            aroundSun: 0.0001,
            aroundSelf: 0.032
        }
    },
    pluto: {
        size: 2.8,
        texture: plutoTexture,
        position: 216,
        rotation: {
            aroundSun: 0.00007,
            aroundSelf: 0.008
        }
    }
}