import lang_j from '@/assets/json_lang/lang.json';
import login_j from '@/assets/json_lang/login.json';
import error_j from '@/assets/json_lang/error.json';
import register_j from '@/assets/json_lang/register.json';
import teacher_j from '@/assets/json_lang/teacher.json';
import user_j from '@/assets/json_lang/user.json';
import consultation_j from '@/assets/json_lang/consultation.json';
import chat_j from '@/assets/json_lang/chat.json';

export function getWord({word,file,lang}){
    let palabra = "???";
    switch(file){
        case 'lang':
            palabra = lang_j[word][lang];
            break;
        case 'login':
            palabra = login_j[word][lang];
            break;
        case 'error':
            palabra = error_j[word][lang];
            break;
        case 'teacher':
            palabra =  teacher_j[word][lang];
            break;
        case 'register':
            palabra =  register_j[word][lang];
            break;
        case 'user':
            palabra =  user_j[word][lang];
            break;
        case 'consultation':
            palabra =  consultation_j[word][lang];
            break;
        case 'chat':
            palabra =  chat_j[word][lang];
            break;
        default:
            palabra = "{missing}";
            break;
    }
    palabra = palabra ? palabra : "{missing}";
    //console.log(palabra);
    return palabra;
}