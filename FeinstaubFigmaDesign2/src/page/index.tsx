import React, {useEffect, useState} from "react";
import "./index.css";
import {getTodaysData} from "../services/getTodaysData";
import {getYesterdaysData} from "../services/getYesterdaysData";
import {getPrognose} from "../services/getPrognose";

export default function Main() {
  const [todaysData, setTodaysData] = useState([{"pm25": 0, "index":"", "description":""}])
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

  const imageUrl = '../assets/images/gelberKreis.png';

  return (
    <div className="main-container">
      <div className="rectangle-1">
        <span className="air-quality">Luftqualität: Feinstaub</span>
        <span className="pm-2-5">
          PM 2,5 (Feinstaub) sind winzige Partikel in der Luft mit einem
          Durchmesser von maximal 2,5 Mikrometern
        </span>
        <div className="rectangle-2">
          <span className="date">Heute, {todaysData[1]?.todayDE}</span>
          <div className="poor-air-quality">
            <span className="poor">{todaysData[0].index}:  Feinstaub (PM₂,₅): {todaysData[0].pm25} µg/m³</span>
          </div>
          <div className="flex-row">
            <div className="group">
              <div className={(todaysData[0].index).trim()}></div>
            </div>
            <span className="health-warning">
              {todaysData[0].description}
            </span>
          </div>
        </div>
        <div className="flex-row-df">
          <div className="rectangle-3">
            <span className="date-4">{yesterdaysData[1]?.yesterdayDE}</span>
            <div className={"ellipse"}>
              <div className={yesterdaysData[0].index.trim()}></div>
            </div>

          </div>
          <div className="rectangle-5">
          <span className="date-6">{prognoseData[1]?.tomorrowDE}</span>
            <div className="flex-row-7">
              <div className={"ellipse-8"}>
                <div className={prognoseData[0].index.trim()}></div>
              </div>
              <span className="feinstaub-pm25">
                 Feinstaub (PM₂,₅): <br/> {prognoseData[0].pm25} µg/m³
              </span>
            </div>
          </div>
          <span className="feinstaub-pm25-9">
             Feinstaub (PM₂,₅): <br />
            {yesterdaysData[0].pm25} µg/m³
          </span>
        </div>
        <div className="rectangle-a">
          <span className="weitere-sensordaten">Weitere Sensordaten</span>
          <span className="heute"> Heute,  {todaysData[1]?.todayDE}</span>
          <div className="ellipse-b" >
            <div className={todaysData[4]?.index.trim()}></div>
          </div>
          <span className="stickstoffdioxid-no2">
            Stickstoffdioxid (NO₂): {todaysData[4]?.stickstoffdioxid} µg/m³
          </span>
          <div className="ellipse-c" >
            <div className={todaysData[2]?.index.trim()}></div>
          </div>
          <span className="feinstaub-pm10">Feinstaub (PM₁₀): {todaysData[2]?.pm10} µg/m³</span>
          <div className="ellipse-d" >
            <div className={todaysData[3]?.index.trim()}></div>
          </div>
          <span className="ozon-o3">Ozon (O₃): {todaysData[3]?.ozon} µg/m³</span>
        </div>
        <span className="bewertungstabelle-pm-tagesdurchschnitt">
          Bewertungstabelle des PM 2,5 Wertes im Tagesdurchschnitt
        </span>
        <div className="flex-row-da">
          <div className="ellipse-e" />
          <span className="sehr-schlecht">sehr schlecht</span>
          <span className="greater-than-50"> 50+ µg/m³</span>
        </div>
        <div className="flex-row-f">
          <div className="ellipse-10" />
          <span className="schlecht">schlecht</span>
          <span className="text-15">26 - 50 µg/m³</span>
        </div>
        <div className="flex-row-bde">
          <div className="ellipse-11" />
          <span className="moderate">mäßig</span>
          <span className="microgram-per-cubic-meter">21 - 25 µg/m³</span>
        </div>
        <div className="flex-row-df-12">
          <div className="ellipse-13" />
          <span className="good">gut</span>
          <span className="microgram-per-cubic-meter-14">11 - 20 µg/m³</span>
        </div>
        <div className="flex-row-e">
          <div className="ellipse-15" />
          <span className="excellent">sehr gut</span>
          <span className="microgram-per-cubic-meter-16">0 - 10 µg/m³</span>
        </div>
      </div>
    </div>
  );
}
