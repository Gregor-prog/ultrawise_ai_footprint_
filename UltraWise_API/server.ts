import { App } from "./app";
import { footPrintController } from "./src/footPrint/footprint.controller";

const app = new App([
    new footPrintController
])

app.listen(4000)