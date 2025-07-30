const getTodaysData = async () => {

    const getFormattedDates = (): {
        todayISO: string;
        yesterdayISO: string;
        todayDE: string;
        yesterdayDE: string;
    } => {
        // Aktuelles Datum holen
        const now = new Date();

        // Heutiges Datum berechnen
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Gestriges Datum berechnen
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Funktion zur Formatierung in YYYY-MM-DD
        const formatISO = (date: Date): string =>
            date.toISOString().split("T")[0];

        // Funktion zur Formatierung in DD.MM.YYYY (mit Intl.DateTimeFormat)
        const formatDE = (date: Date): string => {
            const formatter = new Intl.DateTimeFormat('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
            return formatter.format(date);
        };

        return {
            todayISO: formatISO(today),
            yesterdayISO: formatISO(yesterday),
            todayDE: formatDE(today),
            yesterdayDE: formatDE(yesterday),
        };
    };


    try {
            const response = await fetch(("/api/umwelt/air_data/v3/airquality/json?date_from="+getFormattedDates().yesterdayISO+"&date_to="+getFormattedDates().todayISO+"&station=914"),
             {
                 method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: "no-cors"
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            let data =await response.json()
            data= filterData(data);
            console.log(data)
            return data;
        } catch (error) {
            console.error(error instanceof Error ? error.message : "An unknown error occurred");
            return null;
        }

        function filterData(data: []){
        const stationId = "914"
            // Den ersten verfügbaren Zeitstempel finden
            const timestamps = Object.keys(data.data?.[stationId]);
            if (timestamps.length === 0) {
                throw new Error("No timestamps available");
            }

            const firstTimestamp = timestamps[timestamps.length-2]; // Nimm den ersten verfügbaren Eintrag
            let pm25=0;
            let pm10 =0;
            let ozon=0;
            let stickstoffdioxid;
            for(let i=0; i<= data.data?.[stationId]?.[firstTimestamp].length-1;i++){
                console.log(data.data?.[stationId]?.[firstTimestamp][i])
                if(!Number.isInteger(data.data?.[stationId]?.[firstTimestamp][i])){
                    console.log("ist ein Array")
                    console.log(data.data?.[stationId]?.[firstTimestamp][i][0])
                    if (data.data?.[stationId]?.[firstTimestamp][i][0]===9){
                        pm25= data.data?.[stationId]?.[firstTimestamp][i][1]
                    }
                    else if (data.data?.[stationId]?.[firstTimestamp][i][0]===1){
                        pm10= data.data?.[stationId]?.[firstTimestamp][i][1]
                    }
                    else if (data.data?.[stationId]?.[firstTimestamp][i][0]===3){
                        ozon= data.data?.[stationId]?.[firstTimestamp][i][1]
                    }
                    else if (data.data?.[stationId]?.[firstTimestamp][i][0]===5){
                        stickstoffdioxid= data.data?.[stationId]?.[firstTimestamp][i][1]
                    }
                }
            }
            console.log(pm25)
            let werte;

            switch (true){
                case (0<=pm25 && pm25<=10): werte= [{"pm25":pm25,"index": "Sehr gut", "description":"Beste Voraussetzungen, um sich ausgiebig im Freien aufzuhalten."},getFormattedDates()];break;
                case (11<=pm25 && pm25<=20):  werte=[{"pm25":pm25,"index": "Gut", "description":"Genießen Sie ihre Aktivitäten im Freien, gesundheitlich nachteilige Auswirkungen sind nicht zu erwarten."},getFormattedDates()];break;
                case (21<=pm25 && pm25<= 25): werte=[{"pm25":pm25,"index": "Mäßig", "description":"Kurzfristige nachteilige Auswirkungen auf die Gesundheit sind unwahrscheinlich. Allerdings können Effekte durch Luftschadstoffkombinationen und bei langfristiger Einwirkung des Einzelstoffes nicht ausgeschlossen werden. Zusätzliche Reize, z.B. ausgelöst durch Pollenflug, können die Wirkung der Luftschadstoffe verstärken, so dass Effekte bei empfindlichen Personengruppen (z.B. Asthmatikern) wahrscheinlich werden."},getFormattedDates()];break;
                case (26<=pm25 && pm25<=50): werte=[{"pm25":pm25,"index": "Schlecht", "description":"Bei empfindlichen Menschen können nachteilige gesundheitliche Wirkungen auftreten. Diese sollten körperlich anstrengende Tätigkeiten im Freien vermeiden. In Kombination mit weiteren Luftschadstoffen können auch weniger empfindliche Menschen auf die Luftbelastung reagieren."},getFormattedDates()];break;
                case (pm25>50): werte=[{"pm25":pm25,"index": "Sehr schlecht","description": "Negative gesundheitliche Auswirkungen können auftreten. Wer empfindlich ist oder vorgeschädigte Atemwege hat, sollte körperliche Anstrengung im Freien vermeiden."},getFormattedDates()];break;
            }

            switch (true){
                case (0 <= pm10 && pm10 <= 20): werte[2]=({"pm10":pm10, "index": "Sehr gut"}); break;
                case (21 <= pm10 && pm10 <= 35): werte[2]=({"pm10":pm10, "index": "Gut"}); break;
                case (36 <= pm10 && pm10 <= 50): werte[2]=({"pm10":pm10, "index": "Mäßig"}); break;
                case (51 <= pm10 && pm10 <= 100): werte[2]=({"pm10":pm10, "index": "Schlecht"}); break;
                case (101 <= pm10 ): werte[2]=({"pm10":pm10, "index": "Sehr schlecht"}); break;
            }
            console.log("hier")

            switch (true){
                case (0 <= ozon && ozon <= 60): werte[3]=({"ozon":ozon, "index": "Sehr gut"}); break;
                case (61 <= ozon && ozon <= 120): werte[3]=({"ozon":ozon, "index": "Gut"}); break;
                case (121 <= ozon && ozon <= 180): werte[3]=({"ozon":ozon, "index": "Mäßig"}); break;
                case (181 <= ozon && ozon <= 240): werte[3]=({"ozon":ozon, "index": "Schlecht"}); break;
                case (241 <= ozon ): werte[3]=({"ozon":ozon, "index": "Sehr schlecht"}); break;
            }


            switch (true){
                case (0 <= stickstoffdioxid && stickstoffdioxid <= 20): werte[4]=({"stickstoffdioxid":stickstoffdioxid, "index": "Sehr gut"}); break;
                case (21 <= stickstoffdioxid && stickstoffdioxid <= 40): werte[4]=({"stickstoffdioxid":stickstoffdioxid, "index": "Gut"}); break;
                case (41 <= stickstoffdioxid && stickstoffdioxid <= 100): werte[4]=({"stickstoffdioxid":stickstoffdioxid, "index": "Mäßig"}); break;
                case (101 <= stickstoffdioxid && stickstoffdioxid <= 200): werte[4]=({"stickstoffdioxid":stickstoffdioxid, "index": "Schlecht"}); break;
                case (201 <= stickstoffdioxid ): werte[4]=({"stickstoffdioxid":stickstoffdioxid, "index": "Sehr schlecht"}); break;
            }


            console.log(werte)
            return werte;

    }
};

export { getTodaysData };