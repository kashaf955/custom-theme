import PageManager from './page-manager';
import haloSidebarToggle from './halothemes/haloSidebarToggle';

export default class Page extends PageManager {
    constructor(context) {
        super(context);
    }

    onReady() {
        haloSidebarToggle();
    }
}
