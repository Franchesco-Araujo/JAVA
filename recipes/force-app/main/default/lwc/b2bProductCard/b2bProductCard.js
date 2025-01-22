import { LightningElement, api } from 'lwc';
import { BASE_IMAGE_MEDIA_PATH,MOBILE_INNERWIDTH } from 'c/globalConstants';
import siteId from "@salesforce/site/Id";
import { NavigationMixin } from 'lightning/navigation';
export default class b2bProductCard extends NavigationMixin(LightningElement) {
    channelId = siteId;
    
    _url;
    _altText;

    @api source;
    @api contentId;
    @api urlImage;
    @api alternativeText;
    @api title;
    @api description;
    @api buttonLabel;
    @api redirectUrl;
    @api desktopHeight;
    @api mobileHeight;
    @api desktopWidth;
    @api mobileWidth;

    get slideConfiguration() {
        const desktopHeight = JSON.parse(JSON.stringify(this.desktopHeight));
        const mobileHeight = JSON.parse(JSON.stringify(this.mobileHeight));
        const desktopWidth = JSON.parse(JSON.stringify(this.desktopWidth));
        const mobileWidth = JSON.parse(JSON.stringify(this.mobileWidth));
        const componentWidth = this.isMobile ? mobileWidth : desktopWidth;
        const componentHeight = this.isMobile ? mobileHeight : desktopHeight;
        const componentStyle = `
            height: ${componentHeight};   
            width: ${componentWidth};
            background-image: url('${this.url}');
        `;
        return componentStyle;
    }

    get isMobile() {
        return window.innerWidth < MOBILE_INNERWIDTH;
    }

    get url() {
        if (this.source === 'URL') {
            return this.urlImage;
        }
        return this._url;
    }

    get altText() {
        return this._altText || this.alternativeText;
    }

    connectedCallback() {
        if (this.source === 'URL') {
            this._url = this.urlImage;
            this._altText = this.alternativeText;
        } else if (this.source === 'CMS' && this.contentId) {
            this.getCmsContent();
        }
    }

    //just getting image path and adding contentID to access directly
    getCmsContent() {
        this._url = BASE_IMAGE_MEDIA_PATH + this.contentId;
        this._altText = this.alternativeText;
    }

    handleButtonClick() {
        if (this.redirectUrl) {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: this.redirectUrl
                }
            });
        } else {
            console.warn('Redirect URL was not defined!');
        }
    }
}