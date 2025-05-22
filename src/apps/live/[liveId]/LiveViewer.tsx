import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Badge,
  Text,
  Group,
  Box,
  ActionIcon,
  Paper,
  Flex,
  rem
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconVolume,
  IconVolumeOff,
  IconMaximize,
  IconSettings
} from '@tabler/icons-react';

interface LiveViewerProps {
  streamKey: string;
  viewers?: number;
  onBack?: () => void;
  title?: string;
  streamerName?: string;
}

function LiveViewer({
  streamKey,
  viewers = 0,
  onBack,
  title = '라이브 방송',
  streamerName = '스트리머'
}: LiveViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = `http://192.168.0.6:8088/hls/${streamKey}/index.m3u8`;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().catch((e) => console.error('재생 자동 시작 실패:', e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS 오류:', data);
        if (data.fatal) {
          setError(true);
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadstart', () => setIsLoading(false));
      video.addEventListener('error', () => {
        setError(true);
        setIsLoading(false);
      });
    } else {
      setError(true);
      setIsLoading(false);
    }

    return () => {
      if (hls) hls.destroy();
      video.removeEventListener('error', () => {});
      video.removeEventListener('loadstart', () => {});
    };
  }, [streamKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
  };

  const toggleMute = () => {
    handleVolumeChange(volume > 0 ? 0 : 0.5);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <Box w="100%" maw={1200} mx="auto">
      <Paper
        shadow="md"
        radius="lg"
        style={{
          position: 'relative',
          backgroundColor: '#000',
          overflow: 'hidden',
          aspectRatio: '16/9'
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {error ? (
          <Flex
            align="center"
            justify="center"
            h="100%"
            direction="column"
            gap="md"
            p="xl"
          >
            <Text size="xl" c="white" fw={500}>
              📡 방송 연결 실패
            </Text>
            <Text c="gray.4" ta="center">
              현재 방송을 시청할 수 없습니다.
              <br />
              잠시 후 다시 시도해 주세요.
            </Text>
          </Flex>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted={false}
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {isLoading && (
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.8)'
                }}
              >
                <Text c="white" size="lg">
                  ⏳ 방송 연결 중...
                </Text>
              </Box>
            )}

            <Box
              style={{
                position: 'absolute',
                top: rem(16),
                left: rem(16),
                right: rem(16),
                zIndex: 10
              }}
            >
              <Group justify="space-between">
                <Badge
                  color="red"
                  size="lg"
                  radius="sm"
                  style={{
                    fontSize: rem(12),
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  🔴 LIVE
                </Badge>
              </Group>
            </Box>

            <Box
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: rem(16),
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s ease',
                zIndex: 10
              }}
            >
              <Group justify="space-between">
                <Group gap="sm" align="center">
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={togglePlay}
                    c="white"
                  >
                    {isPlaying ? (
                      <IconPlayerPause size={20} />
                    ) : (
                      <IconPlayerPlay size={20} />
                    )}
                  </ActionIcon>

                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={toggleMute}
                    c="white"
                  >
                    {volume === 0 ? (
                      <IconVolumeOff size={20} />
                    ) : (
                      <IconVolume size={20} />
                    )}
                  </ActionIcon>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    style={{
                      width: rem(100),
                      accentColor: 'white',
                      cursor: 'pointer'
                    }}
                  />
                </Group>

                <Group gap="md">
                  <ActionIcon
                    variant="subtle"
                    size="lg"
                    onClick={handleFullscreen}
                    c="white"
                  >
                    <IconMaximize size={20} />
                  </ActionIcon>

                  <ActionIcon variant="subtle" size="lg" c="white">
                    <IconSettings size={20} />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

export default LiveViewer;
