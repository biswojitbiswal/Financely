import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, FileText } from 'lucide-react';
import { Modal, Button } from 'react-bootstrap';

const Scanner = React.forwardRef(({ isOpen, onClose, onScanComplete }, ref) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Expose setPreviewImage method to parent
  React.useImperativeHandle(ref, () => ({
    setPreviewImage: (imageDataUrl) => {
      setPreviewImage(imageDataUrl);
    }
  }));

  useEffect(() => {
    // Detect device type
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileKeywords.test(userAgent) || window.innerWidth <= 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Auto-start camera for mobile when modal opens
  useEffect(() => {
    if (isOpen && isMobile && !previewImage) {
      startCamera();
    }
  }, [isOpen, isMobile]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsScanning(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPreviewImage(imageDataUrl);
    stopCamera();
  };

  const handleScan = () => {
    if (previewImage) {
      onScanComplete({
        image: previewImage,
        timestamp: new Date().toISOString(),
        deviceType: isMobile ? 'mobile' : 'desktop'
      });
      handleClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setPreviewImage(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Scan Receipt</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isScanning && (
          <div className="position-relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-100 rounded"
              style={{ maxHeight: '400px' }}
            />
            <canvas ref={canvasRef} className="d-none" />
            <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex justify-content-center gap-2">
              <Button variant="primary" onClick={captureImage}>
                Capture
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {previewImage && (
          <div>
            <img
              src={previewImage}
              alt="Receipt preview"
              className="img-fluid rounded mb-3"
            />
            <div className="d-flex justify-content-center gap-2">
              <Button 
                variant="success" 
                onClick={handleScan}
                className="d-flex align-items-center"
              >
                <FileText size={20} className="me-2" />
                Process Receipt
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setPreviewImage(null);
                  if (isMobile) {
                    startCamera();
                  } else {
                    onClose();
                  }
                }}
              >
                Retake
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
});

export default Scanner;