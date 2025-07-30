import React, {useEffect, useState} from "react";
import {getTodaysData} from "../services/getTodaysData";
import {getYesterdaysData} from "../services/getYesterdaysData";
import {getPrognose} from "../services/getPrognose";
import Header from "./components/Header";
import Description from "./components/Description";
import CircleIcon from "./components/CircleIcon";

const Overview = () => {
    const [todaysData, setTodaysData] = useState([{"pm25": 0, "index":"Sehr gut", "description":""}])
    const [yesterdaysData, setYesterdaysData] = useState([{"pm25": 0, "index":"", "description":""}])
    const [prognoseData, setPrognoseData] = useState([{"pm25": 0, "index":"", "description":""}])

    useEffect(() => {

        getTodaysData().then(response=>{
            console.log(response)
            setTodaysData(response)

        })

        getYesterdaysData().then(response=>{
            console.log(response)
            setYesterdaysData(response)
        })

        getPrognose().then(response=>{
            console.log(response)
            setPrognoseData(response)
        })

    }, []);


    return (
        <div>
            <Header title={"Luftqualität: Feinstaub"}/>
            <Description title={"PM 2,5 (Feinstaub) sind winzige Partikel in der Luft mit einem\n" +
                "          Durchmesser von maximal 2,5 Mikrometern"}></Description>
            <div style={{padding: '0 16px '}}>
                <div style={styles.card}>
                    <span style={styles.info}>Heute, {todaysData[1]?.todayDE}</span><br/>
                    <CircleIcon color={(todaysData[0]?.index)}/>
                </div>
            </div>
        </div>
            );
        };

    const styles = {
    card: {
        backgroundColor: 'rgba(255,255,255,1)',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
        marginBottom: '12px',
    },
    info: {
        fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 400,
        fontStyle: 'bold',
        color: 'rgba(0,0,0,1)',
        fontSize: '16px',
        lineHeight: '22px',
        padding: '8px 0'
    },
}

export default Overview
