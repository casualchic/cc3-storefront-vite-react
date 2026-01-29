interface VideoSchemaProps {
  schema: Record<string, unknown> | undefined;
}

export function VideoSchema({ schema }: VideoSchemaProps) {
  if (!schema) {
    return null;
  }

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
