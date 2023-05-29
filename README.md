# OceanusDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.7.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Istruzioni per l'uso
Fare un clone del repository nella directory desiderata, per esempio: <br />
```
cd Documents
git clone https://github.com/SecondarySkyler/oceanus_dashboard.git
```
Installazione dei pacchetti necessari per eseguire l'applicazione: <br />
```
cd oceanus_dashboard
npm install
```
Specificare l'url del server PHP (`!prestare attenzione ai nomi`)
```
cd src/
mkdir environments
cd environments
touch environment.ts
```
Dentro al file `environment.ts` scrivere:
```
export const environment = {
    production: false,
    telemetryUrl: "http://server-ip-address:port/path/to/server.php"
}
```
Salvare e tornare alla directory ``oceanus_dashboard``
```
cd ../../
```
A questo punto si può eseguire l'applicazione Angular attraverso il comando:
```
npm start
```
si aprirà automaticamente una pagina nel browser
