<div align="center">
  <img src="https://user-images.githubusercontent.com/37687705/192227260-db082018-947a-4166-a3f4-983e1024dd59.png" width="20%">
  <h1>Strapi plugin drag-drop-content-types</h1>
</div>

![dragdropcrop](https://user-images.githubusercontent.com/37687705/212884821-356ec68c-b71a-4b89-9e99-8a625f84cfbe.gif)

Inspired by the [Drag-Drop-Content-Type Strapi 4 plugin](https://github.com/plantagoIT/strapi-drag-drop-content-type-plugin).
Drag-drop feature completely rewritten to use dndkit because react-sortable-hoc is deprecated and not compatible with React 18.

## ⏳ Installation

Install with NPM.
```bash
npm i @cslegany/drag-drop-content-types-strapi5
```
Install with Yarn.
```bash
yarn add @cslegany/drag-drop-content-types-strapi5
```

## 🔧 Configuration

### In your config
1. Add the following to your `config/plugins.ts` file. Create the file, if it doesn't exist.
```js
export default () => ({
  // ...
  'drag-drop-content-types': {
    enabled: true
  }
})
```
2. Run `npm run build` and restart the app using `npm run develop`.

### In the app
1. Go to `Settings` → `Drag Drop Content Type` → `Configuration`.
2. Specify the `Rank Field Name` used for sorting or leave the default field name `rank`.
3. Add a `Number` field with `Name: myRankFieldName` and `Number format: integer` to the sortable _ContentType_.
4. Configure the view of your _ContentType_ by adding `Default sort attribute → rank` and `Default sort order → ASC` to update the view after dragging.
5. If needed: grant permissions for the `rank` field to your roles.

#### Hints
* You can set a `title` value that will be displayed in the menu instead of the default field.
* A second field can be displayed in the menu via the `subtitle` setting. It can be either a string-like field or an object such as a relation, that has a `title` field as configured in the settings.
* You can enable webhooks to trigger something after updating the order.

### In your frontend
You can make a request in the frontend to get the ordered items. In this example the _ContentType_ is called `Foo` and ordered via the `rank` field. 

```
http://localhost:1337/api/foo?sort=rank:asc
```

## 🤝 Contribute
Feel free to fork and make pull requests to this plugin. All input is welcome - thanks for all contributions so far!


## ⭐️ Support
I you like this project, please give it a star ⭐️. Maybe this will help it getting integrated to strapi's core some day 😊.
