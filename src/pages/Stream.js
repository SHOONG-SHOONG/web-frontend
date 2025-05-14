import { useParams } from 'react-router-dom';
import StreamViewer from '../services/StreamViewers';

function Stream() {
  const { streamKey } = useParams();

  return (
    <div className="stream-page">
      <StreamViewer streamKey={streamKey} />
    </div>
  );
}

export default Stream;
