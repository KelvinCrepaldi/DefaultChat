const CounterText = ({ list, text }: { list: any[]; text: string }) => {
  return (
    <>
      {list?.length > 0 && (
        <div className="mt-3">
          <span className="text-chatText">
            {list?.length} {text}
          </span>
          <div className="w-full border-b border-chatBorder mb-3"></div>
        </div>
      )}
    </>
  );
};

export default CounterText;
