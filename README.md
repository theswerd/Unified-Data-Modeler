# Unified Data Modeler (UDM)

### What UDM does

Unified Data Modeler (UDM) is a collaborative graphical tool where teams create data models together to be used in the front and backend. The GUI allows users to add parameters, select data types, and toggle whether the parameter is required. Once they’ve customized their models, they can export them to **TS**, **Dart**, **Rust**, **C#**, **Java**, or our custom **UDM format**. **The UDM format** allows users to import their models later on for further customization. 

Unified Data Modeler also includes JSON parsing on each of its objects to make connecting models from language to language as easy as possible. 

We were able to build out a custom type syntax tree to allow users to enter in a specific type, and get the most specific version of it in each language. For example, if a user chooses an `unsigned integer` type, they get a `usize` in **Rust**, an `int` in **Dart**, and a `number` in **TypeScript**.


![DataDesigner - Where we fit in](https://user-images.githubusercontent.com/38309438/114292476-964c4800-9a43-11eb-886e-55e29139b596.png)



### Inspiration

Whenever we start personal or hackathon projects, our team comes together to design data models for the frontend and backend. We often use LucidChart or Google Sheets to plan our models and then individually recreate them on the front and backends. By having to remake the same design multiple times, we run the risk of creating small discrepancies and mistakes that mess up the project. We realized that a great solution would be to create a unified data modeling system, where you would create ONE model to be easily exported to all of your languages. Rather than making essentially the same thing three times, you can use one centralized system for all!


### Usage

Users can deploy their own UDM GUI on [Google Cloud](https://deploy.cloud.run/?git_repo=https://github.com/theswerd/Unified-Data-Modeler.git), [Digital Ocean](https://cloud.digitalocean.com/apps/new?repo=https://github.com/theswerd/Unified-Data-Modeler/tree/main), or [Heroku](https://heroku.com/deploy?template=https://github.com/theswerd/Unified-Data-Modeler.git) with the click of a button. We chose this structure to give everyone access to this tool while saving on costs. Users can also clone the repository and run it with **docker** or **npm**.

[![Run on Google
Cloud](https://deploy.cloud.run/button.svg)](https://deploy.cloud.run/?git_repo=https://github.com/theswerd/Unified-Data-Modeler.git)
[![Run on Digital Ocean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new?repo=https://github.com/theswerd/Unified-Data-Modeler/tree/main)
[![Run on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/theswerd/Unified-Data-Modeler.git)


