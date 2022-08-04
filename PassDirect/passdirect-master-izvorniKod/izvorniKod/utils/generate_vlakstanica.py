import random
from datetime import datetime, timedelta
import pytz


def main():
    CEKANJE = timedelta(minutes=10)
    stanica_id_list = [n for n in range(1, 4)]
    vlakovi_id_list = [n for n in range(1, 4)]
    current_date_time = datetime.now(pytz.timezone('CET'))
    start_date = current_date_time.date()
    print("Dolazak | Polazak | Kasnjenje | idvlak | idstanica")
    for single_date in (start_date + timedelta(n) for n in range(1)):
        ukupno_kasnjenje = timedelta(minutes=0)
        vrijeme = timedelta(hours=5)
        for vlak_id in vlakovi_id_list:
            for stanica_id in stanica_id_list:
                kasnjenje = timedelta(minutes=random.randrange(0, 5))
                ukupno_kasnjenje += kasnjenje
                voznja = timedelta(hours=1, minutes=30)
                vrijeme += voznja
                vrijemedolazak = vrijeme + ukupno_kasnjenje
                vrijeme += CEKANJE
                vrijemepolazak = vrijeme + ukupno_kasnjenje
                print("""INSERT INTO vlakstanica(vrijemedolazak, vrijemepolazak, kasnjenje, idstanica, idvlak)\nVALUES('{}'::TIMESTAMP, '{}'::TIMESTAMP, '{}'::TIME, {}, {});""".format(datetime.combine(single_date, datetime.min.time()) + vrijemedolazak,
                                                                                        datetime.combine(single_date, datetime.min.time()) + vrijemepolazak,
                                                                                        kasnjenje,
                                                                                        stanica_id,
                                                                                        vlak_id))

                #print("{:8s}  {:8s}  {:8s}      {}           {}".format(str(vrijemedolazak), str(vrijemepolazak), str(kasnjenje), vlak_id, stanica_id))


if __name__ == "__main__":
    main()
