export default class Api {
    constructor(url) {
      this._url = url;
    }
  
    getUserInfo() {
      return fetch(this._url +'/users/me', {
        headers: {
          authorization: '9c2e4842-eec0-466f-b33e-0c19fe7195ce'
      }})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Response is not ok with code ${res.status}`);
        }
      })
      .catch(err => {
        console.log(err);
  
        return [];
      });
    }
  
    getInitialCards() {
      return fetch(this._url +'/cards ', {
        headers: {
        authorization: '9c2e4842-eec0-466f-b33e-0c19fe7195ce'
      }})
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Response is not ok with code ${res.status}`);
        }
      })
      .catch(err => {
        console.log(err);
  
        return [];
      });
    }
  
    editProfile(data){
      return fetch(this._url +'/users/me', {
        method: 'PATCH',
        headers: {
          authorization: '9c2e4842-eec0-466f-b33e-0c19fe7195ce',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Response is not ok with code ${res.status}`);
        }
      })
      .catch(err => {
        console.log(err);
  
        return [];
      });
    }
  }