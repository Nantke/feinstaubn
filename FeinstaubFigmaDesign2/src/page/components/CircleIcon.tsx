import React from 'react';

type CircleIconProps = {
    color:string
};

const CircleIcon: React.FC<CircleIconProps> = ({ color }) => {
    return (
        <div style={{...styles.circle,backgroundImage:`url(/${color}.png`}}>

        </div>
    );
};

const styles = {
    circle: {
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
};

export default CircleIcon;
