const getYesterdaysData = async () => {

    const getFormattedDates = (): {
        yesterdayISO: string;
        thedaybeforeyesterdayISO: string;
        yesterdayDE: string;
        thedaybeforeyesterdayDE: string;
    } => {
        // Aktuelles Datum holen
        const now = new Date();

        // Heutiges Datum berechnen
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Gestriges Datum berechnen
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Gestriges Datum berechnen
        const thedaybeforeyesterday = new Date(today);
        thedaybeforeyesterday.setDate(today.getDate() - 2);

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
            yesterdayISO: formatISO(yesterday),
            thedaybeforeyesterdayISO: formatISO(thedaybeforeyesterday),
            yesterdayDE: formatDE(yesterday),
            thedaybeforeyesterdayDE: formatDE(thedaybeforeyesterday),
        };
    };


    try {
        const response = await fetch(("/api/api/air_data/v3/measures/json?date_from="+getFormattedDates().thedaybeforeyesterdayISO+"&date_to="+getFormattedDates().yesterdayISO+"&station=DENI016&lang=de"),
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

        const firstTimestamp = timestamps[timestamps.length-1]; // Nimm den ersten verfügbaren Eintrag
        const pm25=data.data?.[stationId]?.[firstTimestamp][2]
        console.log(pm25)
        let werte;

        switch (true){
            case (0<=pm25 && pm25<=10):return werte= [{"pm25":pm25,"index": "Sehr gut", "description":"Beste Voraussetzungen, um sich ausgiebig im Freien aufzuhalten."},getFormattedDates()]
            case (11<=pm25 && pm25<=20): return werte=[{"pm25":pm25,"index": "Gut", "description":"Genießen Sie ihre Aktivitäten im Freien, gesundheitlich nachteilige Auswirkungen sind nicht zu erwarten."},getFormattedDates()];
            case (21<=pm25 && pm25<= 25):return werte=[{"pm25":pm25,"index": "Mäßig", "description":"Kurzfristige nachteilige Auswirkungen auf die Gesundheit sind unwahrscheinlich. Allerdings können Effekte durch Luftschadstoffkombinationen und bei langfristiger Einwirkung des Einzelstoffes nicht ausgeschlossen werden. Zusätzliche Reize, z.B. ausgelöst durch Pollenflug, können die Wirkung der Luftschadstoffe verstärken, so dass Effekte bei empfindlichen Personengruppen (z.B. Asthmatikern) wahrscheinlich werden."},getFormattedDates()];
            case (26<=pm25 && pm25<=50):return werte=[{"pm25":pm25,"index": "Schlecht", "description":"Bei empfindlichen Menschen können nachteilige gesundheitliche Wirkungen auftreten. Diese sollten körperlich anstrengende Tätigkeiten im Freien vermeiden. In Kombination mit weiteren Luftschadstoffen können auch weniger empfindliche Menschen auf die Luftbelastung reagieren."},getFormattedDates()];
            case (pm25>50):return werte=[{"pm25":pm25,"index": "Sehr schlecht","description": "Negative gesundheitliche Auswirkungen können auftreten. Wer empfindlich ist oder vorgeschädigte Atemwege hat, sollte körperliche Anstrengung im Freien vermeiden."},getFormattedDates()];
            default: return werte=[{"pm25":pm25,"index": "fehler"},getFormattedDates()];
        }

    }
};

export { getYesterdaysData };