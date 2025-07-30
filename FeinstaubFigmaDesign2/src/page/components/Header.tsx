import React from 'react';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header style={styles.wrapper}>
            <h1 style={styles.heading}>{title}</h1>
        </header>
    );
};

const styles = {
    wrapper: {
        paddingLeft: '16px', // ⬅️ links 16px Abstand
        paddingTop: '24px',
        paddingBottom: '8px',
    },
    heading: {
        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 700,
        fontStyle: 'bold',
        color: 'rgba(0,0,0,1)',
        fontSize: '34px',
        lineHeight: '41px',
        letterSpacing: '-0.4px',
        margin: 0,
    },
};

export default Header;
