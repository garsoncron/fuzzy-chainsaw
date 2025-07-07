import React from 'react'
import type { RulesBlock } from '@/payload-types'

interface RulesProps {
  block: RulesBlock
}

export function Rules({ block }: RulesProps) {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              {block.title}
            </h2>
            {block.subtitle && (
              <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
                {block.subtitle}
              </p>
            )}
          </div>

          {/* Rule Categories */}
          {block.ruleCategories && block.ruleCategories.length > 0 && (
            <div className="space-y-8">
              {block.ruleCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-amber-50 rounded-lg p-6">
                  <h3 className="text-2xl font-bold text-amber-900 mb-4 border-b border-amber-200 pb-2">
                    {category.categoryTitle}
                  </h3>
                  
                  {category.rules && category.rules.length > 0 && (
                    <div className="space-y-3">
                      {category.rules.map((ruleItem, ruleIndex) => (
                        <div key={ruleIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-1 flex-shrink-0">
                            {ruleIndex + 1}
                          </div>
                          <p className="text-amber-800 leading-relaxed">
                            {ruleItem.rule}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Additional Information */}
          {block.additionalInfo && (
            <div className="mt-12 bg-amber-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Additional Information
              </h3>
              <p className="text-amber-800 leading-relaxed whitespace-pre-line">
                {block.additionalInfo}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}