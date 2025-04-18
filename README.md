
<img  style="border-radius: 5px" width="50" src="https://mini-metro-web.gitlab.io/app-icon.png">

# Mini Metro Web 
Mini Metro Map Building Tool: `Create mini metro-style subway maps`.

Supports **unlimited** stations and lines, supports **multiple crossings** of the same station, set **background images**, set **sub lines**, and supports **exporting images**.

https://mini-metro-web.gitlab.io/

[中文文档](https://github.com/RyanEdo/mini-metro-web/blob/master/README-cn.md)

## Changelog
#### 1.2.1 `fix adding duplicate stations when double clicking at adding station mode`
#### 1.2.0 `Support for English`
#### 1.1.1 `Added more station shapes, support for modifying default shapes when adding new stations`
#### 1.1.0 `Support for changing background color and background image`
#### 1.0.2 `Added quick recovery notification after refresh`
#### 1.0.1 `Added error guidance`

## Basic Usage

### Menu
Click the title in the top left corner to enter the menu, click any blank area to exit the menu.

### Create Station
1. Menu => Station => Add Station
2. Click on a blank area to add

### Create Line
1. Click any station
2. Select Action => Create new line from this point
3. Follow the prompts to click stations in sequence to add them to the line

### Delete Station/Line
1. Click the station/line
2. Select Action => Delete

### Set Background Image
1. Click the line => Set background
2. Choose `Pure White` / `Light Yellow` / `Color Picker` to set the background color
3. Choose `Import Background Image` to import an image
4. After importing the image, enter the image editing page, where you can drag to adjust the image position and modify the image transparency

### Export Image/File
Menu => Export as image/file

## Advanced Usage
Please refer to the in-app tutorial or video tutorial

## Build

Like most React projects, first run `npm i`, then:

### `npm start`

Run locally
Open http://localhost:3000 to view in the browser.

### `npm run build`

Build into static files

### Note
##### It is recommended to install the `i18n-ally` VS Code plugin. Some strings in the project are generated by this plugin, and after installation, the original text will be automatically displayed at the string location.
