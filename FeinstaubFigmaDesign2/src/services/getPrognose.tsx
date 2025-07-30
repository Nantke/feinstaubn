const getPrognose = async () => {

    const getFormattedDates = (): {
        tomorrowISO: string;
        tomorrowDE: string;
    } => {
        // Aktuelles Datum holen
        const now = new Date();

        // Heutiges Datum berechnen
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Gestriges Datum berechnen
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

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
            tomorrowISO: formatISO(tomorrow),
            tomorrowDE: formatDE(tomorrow),
        };
    };


    try {
        const response = await fetch(("/api/umwelt/air_data/v3/airqualityforecast/json?station=DENI016"),
            {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "User-Agent": "Vercel-Proxy",
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

        const firstTimestamp = timestamps[0]; // Nimm den ersten verfügbaren Eintrag
        const pm25=data.data?.[stationId]?.[firstTimestamp][5][1]
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

export { getPrognose };