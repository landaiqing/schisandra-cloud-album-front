import OpencvQr from "opencv-qr";

/**
 * OpenCV QR detection class
 */
const opencvQr = new OpencvQr({
    dw: "/caffemodel/detect.caffemodel",
    sw: "/caffemodel/sr.caffemodel",
});
export default opencvQr;
