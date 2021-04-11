# Unified Data Modeler (UDM)

[![Run on Google
Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/theswerd/Unified-Data-Modeler.git)
[![Run on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/theswerd/Unified-Data-Modeler.git)
[![Run on Digital Ocean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/theswerd/Unified-Data-Modeler/tree/main)

### What it does

**UDM** is a collaborative tool that allows teams to work together to create data models for their **API Integration Layer**, and export code for those data models in **Rust, TypeScript, and Dart**.

![DataDesigner - Where we fit in](https://user-images.githubusercontent.com/38309438/114292476-964c4800-9a43-11eb-886e-55e29139b596.png)


### Use Case
At the start of any project, the team comes together to decide on what their endpoints will be, and what data models will flow between the frontend and the backend.  Then, the frontend team codes the models for the frontend, and the backend does on the backend. With this system, not only are you coding the same model 3 times, but also small mistakes can also lead to big headaches if someone mistypes even a character. We aim to solve this problem by creating a collaborative graphical tool where teams can create data models together, and then generate their data models from them. This means that you only have to create the models once, and it gets rid of any chance of human error.

### Using
Users can deploy their own UDM GUI on [https://deploy.cloud.run/?git_repo=https://github.com/theswerd/Unified-Data-Modeler.gi](Google Cloud), [https://heroku.com/deploy?template=https://github.com/theswerd/Unified-Data-Modeler.git](Heroku), or [https://cloud.digitalocean.com/apps/new?repo=https://github.com/theswerd/Unified-Data-Modeler/tree/main](Digital Ocean) with the click of a button. We chose this structure to give everyone access to this tool, without bankcrupting ourselves. Users can also clone the repository, and run it with **docker**, or **npm**
