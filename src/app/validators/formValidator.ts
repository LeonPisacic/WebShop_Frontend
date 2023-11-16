import { FormControl, ValidationErrors } from "@angular/forms";

export class formValidator {

    //whitespace validation

    public static notOnlyWhitespace(control: FormControl): ValidationErrors {

        //trim removes white space, and if user typed only whitespaces length will be 0 after trimming
        if ((control.value != null) && (control.value.trim().length === 0)) {

            //invalid, validation should fail

            return { 'notOnlyWhitespace': true };
        }

        //input is valid, not apply any validation errors
        return null;
    }

}
