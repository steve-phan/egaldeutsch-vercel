import { renderHook, act } from "@testing-library/react";
import { useAudioPlayer } from "./use-audio-player";

// Mock Audio
const mockPlay = jest.fn();
const mockPause = jest.fn();

class MockAudio {
  play = mockPlay;
  pause = mockPause;
  onended: (() => void) | null = null;

  constructor(public src: string) {}
}

global.Audio = MockAudio as unknown as typeof Audio;

describe("useAudioPlayer", () => {
  beforeEach(() => {
    mockPlay.mockClear();
    mockPause.mockClear();
  });

  it("initializes with audio url", () => {
    const { result } = renderHook(() => useAudioPlayer("http://example.com/audio.mp3"));
    
    expect(result.current.hasAudio).toBe(true);
    expect(result.current.isPlaying).toBe(false);
  });

  it("toggles play/pause", () => {
    const { result } = renderHook(() => useAudioPlayer("http://example.com/audio.mp3"));

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(true);
    expect(mockPlay).toHaveBeenCalled();

    act(() => {
      result.current.togglePlay();
    });

    expect(result.current.isPlaying).toBe(false);
    expect(mockPause).toHaveBeenCalled();
  });
});
