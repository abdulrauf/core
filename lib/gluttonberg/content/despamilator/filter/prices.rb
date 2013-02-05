module Gluttonberg
  module Content
    module DespamilatorFilter

      class Prices < Despamilator::Filter
        def name
          'Prices'
        end

        def description
          'Detects prices in text.'
        end

        def parse subject
          price_count = subject.text.count(/\$\s*\d+/)
          subject.register_match!({:score => 0.075 * price_count, :filter => self}) if price_count > 0
        end

      end

    end
  end #Content
end #Gluttonberg