import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

function StreamViewer({ streamKey }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 스트림 URL 생성 (서버 주소는 환경 변수로 설정하는 것이 좋습니다)
    const streamUrl = `http://192.168.0.26:8088/hls/${streamKey}/index.m3u8`;
    
    let hls;
    
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error('재생 자동 시작 실패:', e));
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS 오류:', data);
        if (data.fatal) {
          setError(true);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari는 HLS를 네이티브로 지원
      video.src = streamUrl;
      video.addEventListener('error', () => {
        setError(true);
      });
    } else {
      setError(true);
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeEventListener('error', () => {});
    };
  }, [streamKey]);

  return (
    <div className="stream-viewer">
      <h2>라이브 방송</h2>
      {error ? (
        <div className="error-message">
          <p>현재 방송을 시청할 수 없습니다. 잠시 후 다시 시도해 주세요.</p>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          controls 
          className="video-player" 
          style={{ width: '100%', maxWidth: '640px' }}
        />
      )}
    </div>
  );
}

export default StreamViewer;