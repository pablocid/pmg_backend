"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TopBar {
    constructor() {
        this.title = "Plant Biotech";
        this.labels = {
            login: 'logearse',
            languaje: 'Lenguaje',
            lang: ['English', 'Español'],
            adminArea: 'Área de administración'
        };
    }
    get data() {
        return {
            title: 'Lab de Biotech'
        };
    }
}
exports.TopBar = TopBar;
