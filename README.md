

## Add Your Case

Unzip your trajectory record `A-new-case.zip` file and you will get:
```
A-new-case
├──conversation.json    // ShareGpt format
└──images
    └──xxx.png
```

Put this folder to corresponding sub folder in `assets/`, as:
```
assets
│
├── Visual-Puzzle   // Your Section
│   │ 
│   ├── A-new-case  // Put your folder here
│   │   │
│   │   ├──conversation.json
│   │   └──images
│   │       └──xxx.png
│   │   
│   └── ...
│   
├── Geography  
├── Medical
├── Science
└── Information
```

Then add a record in `assets\trajectory_cases.json` and specify `show_name` and `file_dir`

The value of `show_name` will be the displayed case title in the selection bar of your section.

The value of `file_dir` should be relative path of your case folder, which starts with `assets/...`
```json
{
    "Your-Section": [
        {
            "show_name": "Place Holder Case",
            "file_dir": "assets/Your-Section/Following-single-colored-paths"
        },
        {
            "show_name": "Your New Case",
            "file_dir": "assets/Your-Section/Your-new-case"
        }
    ]
}
```

Then you can preview the blog page to check if you have successfully added your new case.


## Local Preview

To preview local web page, do not directly open `python-visual-primitive.html` via your browser, which will open the `.html` web page as `file` and prevent tool use trajectory displayer from loading necessary `.json` files at `./assets`, leading to endless loading. 

> To verify whether you have opened a page as file, check if address shown in your browser starts with `file://`.

Instead, host a local web page at this directory. For example use: `python -m http.server` and open http://localhost:8000/python-visual-primitive.html at your browser to preview.

