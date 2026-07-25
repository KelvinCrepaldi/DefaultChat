const CounterText = <T,>({
  list,
  text,
}: {
  list: T[] | null | undefined;
  text: string;
}) => {
  return (
    <>
      {list && list.length > 0 && (
        <div className="mt-3">
          <span className="text-chatText">
            {list.length} {text}
          </span>
          <div className="w-full border-b border-chatBorder mb-3"></div>
        </div>
      )}
    </>
  );
};

export default CounterText;
