import React from 'react';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header style={styles.wrapper}>
            <h1 style={styles.info}>{title}</h1>
        </header>
    );
};

const styles = {
    wrapper: {
        paddingLeft: '16px', // ⬅️ links 16px Abstand
        paddingTop: '8px',
        paddingBottom: '8px',
    },
    info: {
        fontFamily: '"SF Pro", sans-serif',
        fontWeight: 400,
        color: 'rgba(111,111,110,1)',
        fontSize: '17px',
        lineHeight: '22px',
        letterSpacing: '-0.4px',
        margin: 0,
    },
};

export default Header;
