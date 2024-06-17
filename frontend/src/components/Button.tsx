
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}


const Button = ({ loading,className, disabled, children,...rest  }:any) => {
  return (
    <button
      className={classNames(
        "border-2 text-white bg-goldColor font-semibold rounded-lg px-3 py-2",
        "hover:border-goldColor hover:bg-white hover:text-goldColor",
        loading && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {!loading && children}
      {loading && (
        <div className="flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-5 h-5 border-4 rounded-full" role="status">
        </div>
      </div>
      )}
    </button>
  );
};

export default Button;
