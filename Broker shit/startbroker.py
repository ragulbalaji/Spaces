import mqtt, sys, logging

if __name__ == "__main__":
  formatter = logging.Formatter(fmt='%(levelname)s %(asctime)s %(message)s',  datefmt='%Y%m%d %H%M%S')
  ch = logging.StreamHandler()
  ch.setFormatter(formatter)
  ch.setLevel(logging.INFO)
  broker_logger = logging.getLogger('MQTT broker')
  broker_logger.addHandler(ch)
  broker_logger.propagate = False # don't pass log entries up to the root logger 
  mqtt.brokers.V311.main(sys.argv)
