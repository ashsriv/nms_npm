const { fabric } = require('fabric');
import getSVGData from './svg'
require('jimp/browser/lib/jimp');
const Jimp = window.Jimp;

export class SVGEditor {
    constructor(ref) {
        this.canvas = new fabric.Canvas(ref);
    }

    getCanvas() {
        return this.canvas;
    }

    getObjects() {
        return this.canvas.getObjects();
    }

    createSVGWidget(type, id) {
        const svgData = getSVGData(type);
        fabric.loadSVGFromString((svgData.svg), (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options);
            obj.set({
                left: 0,
                top: 0,
                scaleX: svgData.scaleX,
                scaleY: svgData.scaleY,
                id: `${id}`,
            });
            let title = ``
            let text = new fabric.Text(title, {
                fontFamily: 'ubuntu',
                fontSize: 14,
                textAlign: "center",
            });
            text.set({
                fill: '#000000',
                left: svgData.left,
                top: svgData.top
            })
            const group = new fabric.Group([obj, text], { id: `${id}` })
            // obj.setFill("green");
            this.objects = this.canvas.getObjects();
            this.canvas.add(group).renderAll();

        })
    }

    prepareSVG() {
        return this.canvas.toDatalessJSON(['id']);
    }

    deleteSVGWidget() {
        let activeObject = this.canvas.getActiveObject()
        this.canvas.remove(activeObject);
    }

    setBackgroundImage(imageb64) {
        // var f_img = new fabric.Image(image);
        const imgElem = new Image()
        imgElem.onload = (e) => {
            Jimp.read(imgElem.src)
                .then(image => {
                    image.resize(700, 500)
                        .quality(60)
                        .rgba(false)
                        .background(0xFFFFFFFF)
                        .getBase64(Jimp.MIME_JPEG, (err, img) => {
                            const imgElem = new Image()
                            imgElem.onload = (e) => {
                                const f_img = new fabric.Image(imgElem);
                                this.canvas.setBackgroundImage(f_img).renderAll();
                            }
                            imgElem.src = img;
                        })
                })
                .catch(err => {
                    console.log(err);
                });
        }
        imgElem.src = imageb64;
    }

    renderCanvas() {
        this.canvas.renderAll();
    }

    idGenerator() {
        var id = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return ("floorPlan-" + id() + id() + "-" + id());
    }
}

