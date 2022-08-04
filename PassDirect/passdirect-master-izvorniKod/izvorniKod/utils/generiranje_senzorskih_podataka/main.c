#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#define MAXDULJINARETKA  512
#define MAXKASNJENJE 3
#define MAXBRZINA 80
#define MAXMASA 2000


char ulaz[MAXDULJINARETKA + 1];
char izlaz[MAXDULJINARETKA + 1];
FILE* file;

int dohvatiSljedeciRedak(FILE* file);
int dohvatiSljedeciInt(char** p, char znak);
int main(int argc, char** argv)
{
    int retVal;
    srand(time(0));
    if(argc > 1)
    {
        if(!(file = fopen(argv[1], "rt")))
        {
            printf("GRESKA: Ne mogu otvoriti ulaznu datoteku %s\n", argv[1]);
            exit(1);
        };
    }
    else
        file = stdin;

    // prvi red sadrzi imane stupaca, preskoci ga
    retVal = dohvatiSljedeciRedak(file);
    if(retVal < 0)
    {
        printf("GRESKA: Ulazna datoteka %s je prazna!\n", argv[1]);
        exit(1);
    };
    retVal = dohvatiSljedeciRedak(file);
    while(retVal>0)
    {
        int idvlak, idstanica, polazakH, polazakM, polazakS, brvagona, i;
        char* p = ulaz;

        idvlak = dohvatiSljedeciInt(&p, ',');
        idstanica = dohvatiSljedeciInt(&p, ',');
        p = strchr(p, '"');
        p += 10;
        polazakH = dohvatiSljedeciInt(&p, '"');
        polazakM = dohvatiSljedeciInt(&p, ':');
        polazakS = dohvatiSljedeciInt(&p, ':');
        p += 4;
        brvagona = dohvatiSljedeciInt(&p, ',');

/*        printf("idvlak=%d, idstanica=%d, vrijemepolazak=%02d:%02d:%02d, brvagona=%d\n",
               idvlak,
               idstanica,
               polazakH,
               polazakM,
               polazakS,
               brvagona);*/
        if(!(polazakH == 0 && polazakM == 0 && polazakS == 0))
        {
            polazakM += 1 + (rand() % MAXKASNJENJE);

            if(polazakM >= 60)
            {
                polazakM -= 60;
                polazakH += 1;
                if(polazakH >= 24)
                    polazakH = 0;
            }

            float fbrzina = (float)rand()/(float)(RAND_MAX/MAXBRZINA);

            printf("%d %d %02d:%02d %.1f", idstanica, idvlak, polazakH, polazakM, fbrzina);

            for(i = 0; i < brvagona; i++)
            {
                printf(" %d %d", rand() % MAXMASA, rand() % MAXMASA);
            }

            printf("\n");
        }


        retVal = dohvatiSljedeciRedak(file);
    }




    //printf(izlaz);

    if(argc > 1)
        fclose(file);

    return 0;
}

int dohvatiSljedeciRedak(FILE* file)
{
	memset(ulaz, 0, sizeof(ulaz));
	if(!fgets(ulaz, sizeof(ulaz) - 1, file))
        return -1;
	return(strlen(ulaz));
}

int dohvatiSljedeciInt(char** p, char znak)
{
    *p = strchr(*p, znak);
    if(!*p)
        return -1;
    (*p)++;
    return atoi(*p);
}
