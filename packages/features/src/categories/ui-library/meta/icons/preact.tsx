import { LogoProps } from '../../../../types/meta.js';

export const PreactLogo = ({
  width = 24,
  height = 24,
  color = '#673AB8',
  className = '',
}: LogoProps) => {
  const calculatedHeight = height || width;

  return (
    <svg
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={calculatedHeight}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
    >
      <title>Preact</title>
      <path d="M12 10.406A1.594 1.594 0 0010.406 12 1.594 1.594 0 0012 13.594 1.594 1.594 0 0013.594 12 1.594 1.594 0 0012 10.406zm5.499-4.33c.214.002.433.02.643.054.167.027.328.087.48.172.109.067.204.144.29.235.078.095.14.2.185.315.051.145.077.297.084.452.007.195-.015.398-.058.603-.054.261-.14.521-.244.778-.137.334-.304.66-.49.978-.245.417-.52.818-.817 1.207a9.25 9.25 0 01-.455.561c-.22-.238-.443-.472-.673-.7a23.61 23.61 0 00-2.05-1.797l-.23.296.23-.296-.018-.014-.461.592.018.014c.682.53 1.357 1.113 1.984 1.74.241.237.475.48.703.73-.099.108-.194.22-.296.326-.099.104-.2.207-.301.308l.53.53c.106-.105.21-.212.313-.32.085-.088.164-.182.248-.272.065.078.135.152.198.231.332.398.635.82.909 1.262.211.336.404.681.564 1.036.127.254.22.527.293.806.06.21.09.423.102.637.008.178-.007.351-.05.508-.034.123-.087.239-.157.338h-.001c-.068.098-.157.186-.26.256a1.523 1.523 0 01-.418.191c-.188.054-.39.081-.6.09-.266.01-.538-.01-.814-.05a7.718 7.718 0 01-1.067-.238c-.464-.137-.92-.307-1.369-.5h-.001a17.11 17.11 0 01-1.71-.86l.483-.584c.578-.377 1.144-.77 1.686-1.194l-.21-.27.211.27.018-.015-.463-.59-.017.014c-.695.542-1.418 1.047-2.168 1.505a18.53 18.53 0 01-1.827.983c-.473.219-.954.415-1.444.576a8.68 8.68 0 01-1.142.296c-.286.052-.571.086-.853.09-.222.003-.438-.013-.643-.055a1.477 1.477 0 01-.48-.172.91.91 0 01-.29-.234 1.042 1.042 0 01-.185-.315 1.454 1.454 0 01-.084-.453c-.003-.207.017-.41.058-.603.055-.261.14-.52.245-.777.136-.334.303-.66.49-.978.37-.626.806-1.22 1.271-1.767.232.251.469.497.712.737.66.63 1.328 1.22 2.02 1.765l.461-.591a22.9 22.9 0 01-1.955-1.709 23.43 23.43 0 01-.741-.769c.099-.108.195-.219.295-.325.103-.107.206-.213.31-.317l-.53-.53c-.108.108-.215.218-.321.328-.085.089-.165.183-.248.273-.055-.066-.114-.128-.169-.195a13.317 13.317 0 01-.916-1.263 8.794 8.794 0 01-.571-1.04 5.607 5.607 0 01-.308-.838c-.057-.215-.094-.428-.102-.637a1.67 1.67 0 01.05-.507c.034-.124.087-.239.157-.339h.001c.068-.098.158-.186.26-.256.122-.083.265-.146.419-.19.187-.055.389-.082.599-.09.266-.01.538.01.814.048.357.052.713.135 1.067.24.457.136.92.307 1.369.5.584.253 1.153.543 1.736.874a24.003 24.003 0 00-1.694 1.202l.462.59c.683-.534 1.393-1.031 2.13-1.484.594-.363 1.203-.697 1.83-.99.474-.222.956-.42 1.448-.583.445-.141.878-.237 1.316-.303.298-.056.595-.092.887-.096zm-.01-.75h-.001c-.346.005-.684.047-1.014.108a9.546 9.546 0 00-1.245.329 14.202 14.202 0 00-1.529.616c-.583.272-1.146.582-1.696.91-.121-.073-.243-.145-.367-.215a17.99 17.99 0 00-1.785-.897c-.472-.203-.955-.385-1.455-.531-.38-.112-.772-.204-1.172-.262-.32-.044-.637-.068-.95-.055-.254.01-.516.043-.776.117-.218.064-.436.156-.636.294a1.774 1.774 0 00-.717 1.014c-.068.247-.087.497-.077.737.011.273.06.54.127.798.086.323.203.63.351.959.169.37.378.744.62 1.128.294.466.618.909.967 1.335.08.098.166.19.248.286a12.556 12.556 0 01-.552.679c-.311.408-.604.834-.867 1.282a8.441 8.441 0 00-.538 1.075 5.28 5.28 0 00-.283.908c-.053.249-.083.512-.073.782.01.23.052.464.13.688v.001c.186.407.467.742.81.94.214.126.452.204.697.253.26.056.528.075.805.07.337-.007.657-.043.977-.102h.001a9.412 9.412 0 001.24-.32c.523-.173 1.031-.38 1.526-.61.599-.278 1.178-.593 1.742-.93.121.072.243.144.366.214.578.341 1.176.638 1.785.898.472.203.955.385 1.455.53.38.112.772.204 1.172.262.337.044.674.062.95.056.254-.01.516-.044.776-.118.218-.063.436-.156.636-.294a1.775 1.775 0 00.717-1.014c.068-.248.087-.497.077-.736a3.537 3.537 0 00-.127-.799 5.972 5.972 0 00-.335-.923c-.178-.393-.387-.767-.612-1.127-.294-.466-.618-.908-.959-1.333-.09-.111-.188-.216-.28-.324.189-.222.374-.447.552-.679.311-.409.604-.835.867-1.283.245-.342.447-.704.538-1.075.094-.283.16-.59.283-.907.053-.25.083-.513.073-.783a2.206 2.206 0 00-.13-.688v-.001a1.775 1.775 0 00-.81-.94 2.405 2.405 0 00-.697-.252 3.7 3.7 0 00-.805-.07zM12 0l10.392 6v12L12 24 1.607 18V6L12 0z" />
    </svg>
  );
};
