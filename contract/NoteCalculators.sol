pragma solidity 0.6.0;
contract NoteCalculator {
    uint alreadyInput = 0;
    uint sumofcredits = 0;
    uint sumofnotes =0;
    uint sumc = 0;
    uint sumn = 0;
    struct NoteAndCredit {
        uint note;
        uint credit;
    }
    NoteAndCredit[] noteandcredit;
    function noteAndCreditInput(uint _note, uint _credit)   public {
        noteandcredit.push(NoteAndCredit(_note, _credit));
        alreadyInput++;
    }

    function calculation() public returns(uint) {
        for(uint i=0; i < alreadyInput; i++) {
            sumofcredits = noteandcredit[i].credit + sumofcredits;
            sumofnotes = noteandcredit[i].note * noteandcredit[i].credit+ sumofnotes ;
        }
        uint result = sumofnotes/sumofcredits;
        return result;
    }
    function Calculation(uint _note, uint _credit) public returns(uint) {
         sumn = sumn + _note * _credit;
         sumc = sumc + _credit;
         return sumn / sumc;
    }
}
