
class PaymentService():
    CIJENA_PO_STANICI = 2

    @staticmethod
    def izracunaj_cijenu(polaziste: int, odrediste: int):
        return PaymentService.CIJENA_PO_STANICI * (odrediste - polaziste)
