import { FormControl, ValidationErrors } from "@angular/forms";

export class WizardsValidators {
    //whitespace validation
    static notOnlyWhiteSpace(control : FormControl) : ValidationErrors {

        //checking if the string only has white space
        if((control.value != null ) && (control.value.trim().length === 0)){

            //invalid, return error
            return {'notOnlyWhiteSpace':true}
        }
        else { 
            //valis, return null
            return null;   
        }
    }
}
