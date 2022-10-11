import React from 'react';
import { Button } from 'antd';

function ExportButton({
  onExport,
  children,
}) {
  const [exporting, setExporting] = React.useState(false);
  return (
    <Button
      disabled={exporting}
      size="large"
      onClick={async () => {
        setExporting(true);
        await onExport();
        setExporting(false);
      }}
    >
      {exporting ? 'Exporting' : children}
    </Button>
  );
}

export default ExportButton;
