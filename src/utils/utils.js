import { toast } from 'react-toastify';
import '../styles/toasts.scss'

class Utils {

    capitalizeFirstLetter(text) {
        if (text === '') { return text }

        return text.charAt(0).toUpperCase() + text.slice(1);
    };



    checkForErrors(that, element) {
        console.log('oi')
        if(!element.success) {
            toast.error(`Erro: ${element.message}`, {
                className: 'toast-error'
            });
            return true;
        }
        return false;
    };

    reduceString(string) {
        string = string + '';
        if (string != null && string.length > 3) {
            return string.substring(0, string.length - 3) + 'k';
        } else return string;
    }

    elementsValidator(elements) {
        const varToString = varObj => Object.keys(varObj)[0]
        for (let i = 0; i < elements.length; i++) {
            let value = elements[i][varToString(elements[i])];
            if (!value || value === 0 || value === '') {
                toast.error(`Campo obrigatório: ${varToString(elements[i])}`, {
                    className: 'toast-error'
                })
                return false;
            }
        }
        return true;
    }
}

export default (new Utils());